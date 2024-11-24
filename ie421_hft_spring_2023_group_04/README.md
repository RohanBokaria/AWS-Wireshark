# G4 Netcap

## Introduction

This application aims to simulate a real world trading environment where packets which follow the FIX protocol are being sent between traders and exchanges, which then can be used to analyse the specific latency distribution and averages to monitor network performance.

## Prerequisites

This project has been designed to deploy through vagrant. Make sure to have vagrant installed before hand, along with virtual box to run this project.

## Custom Configurations

If you want to customize how the different VMs are initially brought up, you can do so by modifying the `.env` file located within the `src` folder. By default, these are the values set:

```
MEM_FRONTEND=2048
MEM_BACKEND=2048
MEM_EXCHANGE=512
MEM_TRADER=256

CPU_FRONTEND=2
CPU_BACKEND=2
CPU_EXCHANGE=2
CPU_TRADER=2

NUM_TRADERS=2
NUM_EXCHANGES=2

# These two must be the same
BACKEND_IP=192.168.56.101
REACT_APP_BACKEND_IP=192.168.56.101

# Distributed Exchange Internals
OME_IP=127.0.0.2
TICKER_IP=127.0.0.3
DROPCOPY_IP=127.0.0.4
UDP_BROADCAST_PORT=3200

FRONTEND_IP=192.168.56.100
TRADER_BASE_IP=192.168.56.
EXCHANGE_BASE_IP=192.168.56.
EXCHANGE_START_OCTET=30
EXCHANGE_PORT=3125
TRADER_START_OCTET=10

PROVISION_PATH=./src/provision_scripts
```

## Getting Started

To get started, clone down this repository:

```shell
git clone https://gitlab.engr.illinois.edu/ie421_high_frequency_trading_spring_2023/ie421_hft_spring_2023_group_04/group_04_project.git
```

Then in the directory where the project is, run

```shell
vagrant up
```

### 1. Starting the web application

To start the web application, run the following within the root directory of the project:

```shell
./start_app.sh
```

_Note: This will take a while, since be default, it will attempt to bring up 6 VMs, one for the web frontend, backend, 2 simulated exchanges, and another 2 simulated traders._

### 2. Starting the simulated exchanges

For each exchange dictated by the `NUM_EXCHANGES` field within the `.env` file, you will have to SSH into that VM and start the exchange. The VM are named starting from zero, eg: `fix_exchange_0` or `fix_exchange_1` for the second, and so on. Run the following commands to SSH and start each simulated exchange:

```shell
vagrant ssh fix_exchange_#
```

Where # is the exchange you are aiming to start. After which you will run the following to start the exchange.

```shell
~/vagrant/start_exchange.sh
```

Then you may proceed to exit the VM:

```shell
exit
```

### 3. Starting the simulated traders

For each trader dictated by the `NUM_TRADERS` field within the `.env` file, you will have to SSH into that VM and start the trader. The VM are named starting from zero, eg: `fix_trader_0` or `fix_trader_1` for the second, and so on. Run the following commands to SSH and start each simulated trader:

```shell
vagrant ssh fix_trader_#
```

Where # is the trader you are aiming to start. After which you will run the following to start the trader.

```shell
~/vagrant/start_trader.sh
```

Then you may proceed to exit the VM:

```shell
exit
```

### Accessing the website

Once everything has been booted up, head over to `192.168.56.100:3000` or whatever the IP has been set for the frontend to access the site.

### Stopping the simulation

Stopping the trading simulation is much more straight-forward. Simply run the following command on your host machine within the root directory of this project:

```shell
./stop_sim.sh
```

---

## Contributors

### Project Lead: Adrian Cheng

acheng27@illinois.edu

### Batuhan Usluel

busluel2@illinois.edu

### Zijing Wei

zijingw4@illinois.edu

### Yunfan Hu

yunfanh2@illinois.edu
