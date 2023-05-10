# interviewtask

## Running Locally

### Cloning the repository the local machine.

```bash
git clone
```

### Storing Basic key in .env file.

Create a file in root directory of project with env. And store your Basic key in it, as shown in the .example.env file.


### Installing the dependencies.

```bash
npm install pm2 -g
```

### Create the application database table.

```bash
npm run migration.js
```

### Running the application.

Then, run the application in the command line and it will be available at `http://localhost:3000`.

```bash
pm2 start ecosystem.config.js
```
