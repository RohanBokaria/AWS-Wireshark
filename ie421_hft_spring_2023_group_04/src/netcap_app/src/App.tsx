import './App.css';
import AppLayout from './AppLayout';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from '@material-tailwind/react';

function App() {
    const queryClient = new QueryClient();
    return (
        <QueryClientProvider client={queryClient}>
            <ThemeProvider>
                <AppLayout />
            </ThemeProvider>
        </QueryClientProvider>
    );
}

export default App;
