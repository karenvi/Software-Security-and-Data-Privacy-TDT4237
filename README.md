# SecureHelp

Security application for TDT4237 Spring 2023. Make sure to read this whole file before starting to work with the application. This document contains the following instructions:

- Prerequisites
- Gitlab authentication
- Running the code
- Assumptions

---

## Notice

The application will run on the port defined in .env. The port is a combination of $PORT_PREFIX + $GROUP_ID. For the default configuration of the main repository the application will run on http://localhost:21190.

---

## Prerequisites

The following must be installed before running this application.

- [Git](https://git-scm.com/downloads/) - Version control and production
- [Docker Desktop](https://docs.docker.com/engine/install/) - Development and deployment (must be running)
- [VPN](https://i.ntnu.no/wiki/-/wiki/English/Install+VPN) - Connection to NTNU servers
- [Python < 3.9](https://www.python.org/) - Only required for local development w/o Docker
- [Node >= 16](https://nodejs.org/en/) - Only required for local development w/o Docker

---

## Gitlab authentication

Gitlab relies on a few security features to be able to use their system. First, one must be connected to NTNU's VPN to perform Git interactions with the project. One thing is that it doesn't rely on password authentication when interacting using Git. Therefore one must set up SSH keys or use access tokens. 

- [Alternative 1: Clone with SSH keys](https://gitlab.stud.iie.ntnu.no/-/profile/keys)

`git clone git@gitlab.stud.idi.ntnu.no:tdt4237/2023/securehelp.git`

- [Alternative 2: Clone with personal access tokens](https://gitlab.stud.idi.ntnu.no/-/profile/personal_access_tokens)

`git clone https://gitlab.stud.idi.ntnu.no/tdt4237/2023/securehelp.git`

Provide username and your personal access token as password when prompted. Alternatively insert YOUR-ACCESS-TOKEN in the URL as shown below.

`git clone https://oauth2:<YOUR-ACCESS-TOKEN> @gitlab.stud.idi.ntnu.no/tdt4237/2023/securehelp.git`

You should now have the directory locally and can enter it before continuing.

`cd securehelp`

---

## Running the code

In this section three different ways of running the code will be presented. There are mainly two different ways of running the code; 1) With Docker 2) Without Docker. Your code will always be evaluated when running with Docker, and we strictly require that the application in fact runs in production mode to be accepted. This criteria has led to some frustration as students had to choose between building the production images everytime they want to test the code or rely on local development without Docker. 

The first method is slow and the second method can be tricky and inconsistent with the production build. Therefore we introduce a third method this year: Running development mode with Docker. It is recommended to use development with Docker to make changes to the application, and Docker production when delivering the code. One may still perform local development without Docker, but one would want to stick to one of the development methods.

---

### Development with Docker

Running Docker in development mode allows Docker to automatically refresh whenever you make changes to the local code. This is supposed to be the simplest way to work with the code, but will not be used to deliver the code. Use the following command to run Docker in development mode:

- `docker-compose -f docker-compose.dev.yml up --build`

The application will now run on: http://localhost:21XXX/ (XXX = GroupID, e.g., http://localhost:21042/).

The containers will automatically refresh if changes are made in /backend, /frontend/src or /nginx/nginx.conf. Both Django and Node runs in development mode, this means that they automatically detect changes and compile the code on the fly. Meaning that there is no need to restart the containers when making changes in these directorties.

However, the NGINX gateway container does not have functionality to automatically reload the configuration. This is how you should reload the NGINX configuration without restarting the containers. First your containers must be running and you can enter the gateway using Docker:

- `docker exec -it gateway_group_<GROUP_ID> bash`

You can now leave this terminal window open while working with NGINX. Every time you want to reload the configuration you should write the following command in the bash terminal for the NGINX gateway:

- `/etc/init.d/nginx reload`

---

### Production (with Docker)

The following sections describe how to run the application with Docker and Gitlab Runner. We are using Docker to prevent issues with different versions and platforms, effectively "it runs on my computer" (but only there), should not be an issue. Your application will always be evaluated when being deployed by Docker. **Your code will be considered as delivered when you push it to the "production" branch in your repository.**

#### **Docker build**

- `docker-compose up --build`

This might take a little while, and the frontend build takes additional time, a minute or so. If the page shows "502 Bad Gateway", then one must wait untill docker completes "Creating an optimized production build...". This also holds when deploying with Gitlab Runner. The application will eventually run on http://localhost:21XXX/ (XXX = GroupID).

#### **Gitlab Runner (CODE DELIVERY)**

The repository is configured such that changes pushed to the "production" branch will automatically be deployed on http://molde.idi.ntnu.no:21XXX/ (XXX = GroupID). This can be used for testing the deployed application and should be used for pushing code after fixing vulnerabilities. Typical workflow after finishing development on the master branch would be:

- `git checkout production`
- `git merge master`
- `git push origin production`
- Go to "CI/CD" and "pipelines" within this Gitlab repository to monitor deployment.

This will at least take a few minutes, or up to around 10 minutes if there are several groups deploying at once. If the panel shows that the job is "pending", then that is because the runners are in use by different groups and you will have to wait untill they are complete before the job starts. There are 10 runners in total. Meaning that only 10 groups can execute a job simultaneously. Therefore, one should only push to production when the code has already been tested locally.

---

### Development without Docker (optional)

The following sections describe how one should run the backend and frontend code for development purposes. This should not be necessary if you are comfortable with using Docker in development mode.

#### **Backend**

Go to the backend directory:

- `cd backend`

Before running the backend one should use a [virtualenvironment](https://virtualenv.pypa.io/en/latest/index.html):

- `pip install --user virtualenv`
- `virtualenv venv`
- `source venv/bin/activate` or `venv/Scripts/activate` depending on the folders generated (UNIX/Windows).

To run the backend server, run the following commands:

- `pip install -r requirements.txt`
- `python manage.py migrate`
- `python manage.py runserver`

The instance will be running at http://localhost:8000/ and code changes should update the running code automatically when saving.

After installing once, you only need to run the `python manage.py runserver` command to start the django server.

Admin users can be created with

- `python manage.py createsuperuser`

The admin page can be accessed at http://localhost:8000/admin/

#### **Frontend**

To run the frontend server, run the following commands:

- `cd frontend`
- `npm ci`
- `npm start`

After installing once, you only need to run the `npm start` command to start the react server.

The instance will be running at http://localhost:3000/ and code changes should update the running code automatically when saving.

---

## Assumptions

- The .env file is assumed to be an external file, and would not be part of this repository for a real project. Having passwords in a file on the hosted repository is considered a security risk.

