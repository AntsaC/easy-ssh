#!/usr/bin/env node

import yargs from 'yargs/yargs';

import { hideBin } from 'yargs/helpers';
import { Client } from 'ssh2';
import { newConnection, promptBuilder } from './core.js';
import inquirer  from "inquirer";

const argv = yargs(hideBin(process.argv))
    .command('new <name>', 'Create a new connection', (yargs) => {
        yargs.positional('name', {
            type: 'string',
            describe: 'Connection name'
        });
    }, async (argv) => {
        const answer = await inquirer.prompt([
            promptBuilder('host','Enter host: '),
            promptBuilder('user','Enter user: '),
            promptBuilder('password','Enter password: '),
        ])
        newConnection({
            name: argv.name,
            host: answer.host,
            user: answer.user,
            password: answer.password
        })
    })
    .demandCommand()
    .help()
    .argv;