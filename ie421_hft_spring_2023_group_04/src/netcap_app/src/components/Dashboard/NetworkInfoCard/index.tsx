import { useQuery } from '@tanstack/react-query';
import { useEffect, useRef, useState } from 'react';
import { ForceGraph2D } from 'react-force-graph';
import TitledDivider from '../../TitledDivider';
import { socket } from '../../LatencyAnalytics/socket';

const NetworkInfoCard = () => {
    const { data: graphData } = useQuery({
        queryKey: ['NetworkGraphDataQuery'],
        queryFn: async () => {
            let res = await (
                await fetch(
                    `http://${process.env.REACT_APP_BACKEND_IP}:3000/graphData`,
                )
            ).json();
            if (!res.nodes) res.nodes = [];
            if (!res.links) res.links = [];
            return res;
        },
    });

    const fgRef = useRef<any>();

    const [height, setHeight] = useState<number>(0);
    const [width, setWidth] = useState<number>(0);
    const cardRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new ResizeObserver((entries) => {
            setWidth(entries[0].contentRect.width);
            setHeight(entries[0].contentRect.height);
        });
        if (cardRef.current) observer.observe(cardRef.current);
        return () => {
            cardRef.current && observer.unobserve(cardRef.current);
        };
    }, []);

    useEffect(() => {
        socket.connect();
        socket.on('graph', (body: { source: string; target: string }) => {
            fgRef.current?.emitParticle(
                graphData.links.find(
                    (link: {
                        source: { id: string };
                        target: { id: string };
                    }) =>
                        link.source.id === body.source &&
                        link.target.id === body.target,
                ),
            );
        });
        return () => {
            socket.off('graph');
            socket.disconnect();
        };
    }, [graphData]);

    return (
        <div className="shadow-md w-auto rounded-lg bg-white mb-5 p-5">
            <TitledDivider title="Network Activity" />
            <div className="w-full h-[calc(100vh-15em)]" ref={cardRef}>
                <ForceGraph2D
                    ref={fgRef}
                    graphData={graphData}
                    width={width}
                    height={height}
                    backgroundColor={'rgba(0,0,0,0)'}
                    nodeLabel={'id'}
                    linkLabel={'msg_count'}
                    nodeCanvasObject={(node, ctx, globalScale) => {
                        const label = node.name;
                        const fontSize = 20 / globalScale;
                        ctx.font = `bold ${fontSize}px Sans-Serif`;
                        const textWidth = ctx.measureText(label).width + 2;
                        const bckgDimensions = [textWidth, fontSize].map(
                            (n) => n + fontSize * 1.5,
                        ); // some padding

                        ctx.fillStyle = 'rgba(159, 197, 34, 1)';
                        ctx.beginPath();
                        ctx.roundRect(
                            node.x! - bckgDimensions[0] / 2,
                            node.y! - bckgDimensions[1] / 2,
                            bckgDimensions[0],
                            bckgDimensions[1],
                            1,
                        );
                        ctx.fill();

                        ctx.textAlign = 'center';
                        ctx.textBaseline = 'middle';
                        ctx.fillStyle = 'rgba(255, 255, 255, 1)';
                        ctx.fillText(label, node.x!, node.y!);

                        node.__bckgDimensions = bckgDimensions; // to re-use in nodePointerAreaPaint
                    }}
                    nodePointerAreaPaint={(node, color, ctx) => {
                        ctx.fillStyle = color;
                        const bckgDimensions = node.__bckgDimensions;
                        bckgDimensions &&
                            ctx.fillRect(
                                node.x! - bckgDimensions[0] / 2,
                                node.y! - bckgDimensions[1] / 2,
                                bckgDimensions[0],
                                bckgDimensions[1],
                            );
                    }}
                    linkDirectionalParticleColor={() => 'rgba(34, 197, 156, 1)'}
                    linkDirectionalParticleWidth={3}
                    linkDirectionalParticleSpeed={0.02}
                    linkCurvature={0.1}
                    linkLineDash={[0.5, 0.5]}
                    linkDirectionalArrowLength={1.75}
                    linkDirectionalArrowRelPos={0.5}
                    enableZoomInteraction={false}
                    enablePanInteraction={false}
                    cooldownTicks={50}
                    onEngineStop={() => fgRef.current?.zoomToFit(400)}
                />
            </div>
        </div>
    );
};

export default NetworkInfoCard;
