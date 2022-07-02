# SecureHelp

Security application for TDT4237 Spring 2023

## Prerequisites

The following must be installed before running this application.

- [Git](https://git-scm.com/downloads/) 
- [Docker Desktop](https://docs.docker.com/engine/install/) - Deployment
- [Python >= 3.9](https://www.python.org/) - Development
- [Node >= 14](https://nodejs.org/en/) - Development
- [VPN](https://i.ntnu.no/wiki/-/wiki/English/Install+VPN) - Connection to NTNU servers 

### Alternative 1: Clone with personal access tokens

New Gitlab security features require generation of personal access tokens. To clone the repository you have to:

- Generate your own token https://gitlab.stud.idi.ntnu.no/-/profile/personal_access_tokens
- `git clone https://oauth2:<YOUR-ACCESS-TOKEN>@gitlab.stud.idi.ntnu.no/tdt4237/2023/securehelp.git`
- `cd securehelp`

### Alternative 2: Clone with SSH keys

- Instructions from Gitlab: https://gitlab.stud.iie.ntnu.no/-/profile/keys

All commands from here on out are within the securehelp directory unless specified.

## Development

The following sections describe how one should run the backend and frontend code for development purposes.

### Backend

Go to the backend directory:

- `cd backend`

Before running the backend one should use a [virtualenvironment](https://virtualenv.pypa.io/en/latest/index.html):

- `pip install --user virtualenv`
- `virtualenv venv`
- `source venv/bin/activate` or `source venv/Scripts/activate` depending on the folders generated (UNIX/Windows).

To run the backend server, run the following commands:

- `pip install -r requirements.txt`
- `python manage.py migrate`
- `python manage.py runserver`

The instance will be running at http://localhost:8000/ and code changes should update the running code automatically when saving.

After installing once, you only need to run the `python manage.py runserver` command to start the django server.

Admin users can be created with

- `python manage.py createsuperuser`

The admin page can be accessed at http://localhost:8000/admin/

### Frontend

To run the frontend server, run the following commands:

- `cd frontend`
- `npm ci`
- `npm start`

After installing once, you only need to run the `npm start` command to start the react server.

The instance will be running at http://localhost:3000/ and code changes should update the running code automatically when saving.

## Deployment

The following sections describe how to run the application with Docker and Gitlab Runner. We are using Docker to prevent issues with different versions and platforms, effectively "it runs on my computer" (but only there), should not be an issue. Your application will always be evaluated when being deployed by Docker. 

### Docker

- `docker-compose up --build`

This might take a little while, and the frontend build takes additional time, a minute or so. If the page shows "502 Bad Gateway", then one must wait untill docker completes "Creating an optimized production build...". This also holds when deploying with Gitlab Runner. The application will eventually run on http://localhost:21XXX/ (XXX = GroupID).

### Gitlab Runner

The repository is configured such that changes pushed to the "production" branch will automatically be deployed on http://molde.idi.ntnu.no:21XXX/ (XXX = GroupID). This can be used for testing the deployed application and should be used for pushing code after fixing vulnerabilities. Typical workflow after finishing development on the master branch would be:

- `git checkout production`
- `git merge master`
- `git push origin production`
- Go to "CI/CD" and "pipelines" within this Gitlab repository to monitor deployment.

This will at least take a few minutes, or up to around 10 minutes if there are several groups deploying at once. If the panel shows that the job is "pending", then that is because the runners are in use by different groups and you will have to wait untill they are complete before the job starts. There are 10 runners in total. Meaning that only 10 groups can execute a job simultaneously. Therefore, one should only push to production when the code has already been tested locally.

## Assumptions

- The .env file is assumed to be an external file, and would not be part of this repository for a real project. Having passwords in a file on the hosted repository is considered a security risk.

## Known issues

### MFA bug

The MFA otp might ocasionally get bugged and become invalid even when it should be valid. The precondition is not known for certain. But it seems to happen when recreating the project from a new clone. If this happens then it might help to flush the database. You will have to recreate the token in the authenticator app aswell.

- `python3 manage.py flush`
- `python3 manage.py runserver`