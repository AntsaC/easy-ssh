# Easy ssh
This is a simple and reusable ssh client cli based on ``yargs`` and ``ssh2``
## Requirements
- Node --v.10.16.0 or newer
## Installation
```
npm i -g antsa-easy-ssh
```
## Simple usage
### Create new connection 
```
easy-ssh new example
? Enter host :
? Enter user :
? Enter password :
```
### Connect to ssh 
```
easy-ssh connect example
```
### List all connection 
```
easy-ssh list
```
### Help
```
easy-ssh --help
```