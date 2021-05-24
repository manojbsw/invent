
# Stock-ticker service
A service to fetch stock prices of a given stock symbol. This services uses the API provided by https://marketstack.com/ to get the stock details.

# OpenAPI
API's are exposed through swagger.
1. Register user <ap/v1/user> : User needs to register with emailId and password. 
2. User Login </api/v1/user/login>: User can login with emailId and password. In response we will get access token which will be used by other REST API for authentication.
3. Get End Of Day stock price: This API is used to get the stock prices of given stock symbol and date (format:YYYY-MM-DD).
   In order to authenticate this API user needs to acess token.    
4. OpenAPI's are exposed through swagger. Can be access using URL https://<host>:8443/api-docs/

# Implementation Details
Implementation of this service is done in layered architecture like router and service layer etc. 
1. At present we are maintining the user in memory. So once the service is down user will be removed. User registration is abstracted so that it can be handled by other service if require.
2. Stock ticker related API's are authenticated with breaer token, default validity of this token is 30 minutes. It is conifugrable in /stock-ticker/modules/config/config.json. We can volume mount this file to make it externally configurable.
3. At present service uses self signed certificate, In order to support public (CA signed) certificate, We can volume mount 
   /stock-ticker/certs folder and update it with new certificate.
4. Transaction and access logs are captured in ticker.log and access.log file. This can be mounted on host machine using folder 
   /stock-ticker/logs
5. Each service call is added with transactionId (if it is not present in header). This will be used to track the request across internal and external service call.
   Eg log with transactionId:  2021-05-23T07:20:24.861Z - info thread: 7024 : 0nddl0z-Q : Started : Creating user.
6. Rest API /heartbit is added to support readinessProbe and livenessProbe
7. Rest API /api/v1/ticker/health is added to check the resource utilization by the service.

# Setting up application
We can setup this applicatoin either pulling image from docker hub or create new image.
1. Pull image from docker hub using:
   
   a. docker pull <image_path>
2. Clone the code base from git location:https://github.com/manojbsw/stock-ticker.git
   
   a. Build new image. Change current directory to cloned codebase.   
      docker build -t invent/stock-ticker .
3. Start application using docker run.
   
   docker run docker run -d -p 8443:8443 -v /<host_machine_dir>/logs:/stock-ticker/logs invent/stock-ticker   
4. Access the application using openAPI url https://<host>:8443/api-docs/  

# Prerequisite for application setup  
1. Need to have docker enginee running.
2. I have used free API provided by https://marketstack.com/. We need to have apikey provided https://marketstack.com/. Which is configurable as "marketStackAccessKey" property in /stock-ticker/modules/config/config.json
  
# Software Used:
1. Docker engine: Docker version 19.03.5 is used to build the image.
2. Nodejs: Alpine OS based Nodejs:12 base image is used

