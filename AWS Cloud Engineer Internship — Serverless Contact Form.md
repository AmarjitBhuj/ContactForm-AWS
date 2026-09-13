# AWS Cloud Engineer Internship Project
## Serverless Contact Form Application Using Amazon S3, API Gateway and AWS Lambda

### 1. Project Overview

The objective of this project was to build and deploy a small cloud-hosted application using AWS services.

The application is a static contact/feedback website hosted on Amazon S3. Users can submit their name, email address, and message through a contact form. The submitted data is sent to an Amazon API Gateway endpoint, which invokes an AWS Lambda function for server-side validation and processing.

The project demonstrates:

- Static website hosting on AWS
- Serverless backend architecture
- API creation using API Gateway
- AWS Lambda functions
- Client-side and server-side validation
- Cross-Origin Resource Sharing (CORS)
- CloudWatch logging
- Basic AWS security and cost awareness

---

# 2. Project Architecture

The application follows this architecture:

```text
                    USER / BROWSER
                          |
                          |
                          v
              +-----------------------+
              |     Amazon S3         |
              |   Static Website      |
              |                       |
              | index.html            |
              | style.css             |
              | script.js             |
              +-----------------------+
                          |
                          | HTTPS POST /contact
                          v
              +-----------------------+
              |    API Gateway        |
              |   HTTP API            |
              |                       |
              | POST /contact         |
              +-----------------------+
                          |
                          v
              +-----------------------+
              |     AWS Lambda        |
              | cloud-contact-handler  |
              |                       |
              | Request Validation    |
              | Response Generation   |
              +-----------------------+
                          |
                          v
              +-----------------------+
              |   Amazon CloudWatch    |
              |     Execution Logs     |
              +-----------------------+
```

### Request Flow

1. A user opens the static website hosted on Amazon S3.
2. The user fills out the contact form.
3. JavaScript validates the input on the client side.
4. The browser sends a `POST` request to API Gateway.
5. API Gateway invokes the Lambda function.
6. Lambda validates the request again on the server side.
7. Lambda returns a success or failure response.
8. API Gateway returns the response to the browser.
9. Lambda execution information is available through CloudWatch Logs.

---

# 3. AWS Services Used

| AWS Service | Purpose |
|---|---|
| Amazon S3 | Hosts the static frontend |
| Amazon API Gateway | Provides the HTTP API endpoint |
| AWS Lambda | Processes and validates form submissions |
| Amazon CloudWatch | Stores Lambda execution logs |
| AWS IAM | Provides Lambda execution permissions |

---

# 4. Frontend Implementation

The frontend consists of three files:

```text
index.html
style.css
script.js
```

### index.html

The HTML file provides the structure of the website, including:

- Navigation/header
- Hero section
- Contact form
- Name field
- Email field
- Message field
- Submit button
- Response message
- AWS/serverless architecture section
- Footer

### style.css

The CSS file provides:

- Responsive design
- Form styling
- Buttons and cards
- Validation states
- Responsive mobile layout
- AWS-inspired visual design

### script.js

The JavaScript file handles:

- Form validation
- Character counting
- Error messages
- API communication
- Loading state
- Success/failure responses

The frontend communicates with API Gateway using:

```javascript
const API_URL = "https://qyvdjginwh.execute-api.us-east-1.amazonaws.com/contact";
```

The request is sent using an HTTP `POST` request with JSON data.

Example request:

```json
{
  "name": "Amarjit",
  "email": "test@example.com",
  "message": "Hello from CloudContact"
}
```

---

# 5. Amazon S3 Configuration

An S3 bucket was created for hosting the static website.

The following files were uploaded to the root of the bucket:

```text
index.html
style.css
script.js
```

Static website hosting was enabled with:

```text
Index document: index.html
```

The bucket was configured to allow public read access to the website objects because the assignment requires the website to be publicly accessible.

A bucket policy was configured with the following principle:

```text
Allow public s3:GetObject access
```

This allows visitors to retrieve the website files while not granting them permission to upload, modify, or delete objects.

### Security consideration

No passwords, API keys, credentials, or sensitive information are stored in the public S3 bucket.

For a production application, Amazon CloudFront with Origin Access Control would be preferable to direct public S3 website access.

---

# 6. API Gateway Configuration

An HTTP API named:

```text
cloud-contact-api
```

was created using Amazon API Gateway.

### API Details

```text
API Type: HTTP
Region: us-east-1
API ID: qyvdjginwh
```

### Route

```text
POST /contact
```

### Integration

The route is connected to:

```text
AWS Lambda
cloud-contact-handler
```

The final API endpoint used by the frontend is:

```text
https://qyvdjginwh.execute-api.us-east-1.amazonaws.com/contact
```

The API was successfully tested independently using a POST request.

---

# 7. AWS Lambda Implementation

A Lambda function named:

```text
cloud-contact-handler
```

was created.

The function is responsible for:

1. Receiving the API request.
2. Reading the request body.
3. Parsing the JSON data.
4. Validating the submitted fields.
5. Returning a success response for valid requests.
6. Returning an appropriate error response for invalid requests.
7. Handling unexpected errors.

### Validation Rules

| Field | Validation |
|---|---|
| Name | Required, minimum 2 characters, maximum 50 |
| Email | Required and checked against an email format |
| Message | Required, minimum 10 characters, maximum 500 |

The backend validation is important because client-side validation alone cannot be trusted.

---

# 8. Lambda Response

For a valid request, Lambda returns an HTTP `200` response similar to:

```json
{
  "message": "Your message has been submitted successfully!"
}
```

For invalid requests, the function returns an appropriate HTTP `400` response.

For example, if the request body is missing:

```json
{
  "message": "Request body is required."
}
```

This demonstrates basic backend request validation and error handling.

---

# 9. CORS Configuration

Initially, the API used:

```text
Access-Control-Allow-Origin: *
```

This allowed the frontend to communicate with API Gateway during development.

After the S3 website was successfully deployed, CORS was restricted to the actual S3 website origin.

The API allows:

```text
Methods:
POST
OPTIONS
```

and:

```text
Allowed Header:
Content-Type
```

Credentials were not enabled.

This allows the browser-hosted frontend to communicate with the API while reducing unnecessary cross-origin access.

---

# 10. IAM Configuration

The Lambda function was assigned an execution role with basic Lambda execution permissions.

The role allows Lambda to perform its basic execution tasks and write execution information to CloudWatch Logs.

The project follows the principle of giving services only the permissions required for their function.

No unnecessary permissions such as administrator access were required for the application runtime.

---

# 11. CloudWatch Monitoring

AWS Lambda execution logs are automatically available through Amazon CloudWatch Logs.

The Lambda log group follows the naming convention:

```text
/aws/lambda/cloud-contact-handler
```

CloudWatch can be used to inspect:

- Lambda invocations
- Execution status
- Errors
- Execution duration
- Debugging information

This provides basic monitoring and troubleshooting capability for the serverless application.

---

# 12. Testing

The application was tested at multiple levels.

### Test 1 — Lambda

Lambda was tested directly using an event containing:

```json
{
  "body": "{\"name\":\"Amarjit\",\"email\":\"test@example.com\",\"message\":\"Hello from AWS Lambda\"}"
}
```

The Lambda returned a successful response.

### Test 2 — API Gateway

API Gateway was tested using:

```json
{
  "name": "Amarjit",
  "email": "test@example.com",
  "message": "Hello from API Gateway"
}
```

The API successfully invoked Lambda and returned:

```text
Your message has been submitted successfully!
```

### Test 3 — Local Frontend

The website was run through Live Server and tested from a web browser.

CORS configuration was added to API Gateway so that the browser could successfully communicate with the API.

### Test 4 — S3 Hosted Website

Finally, the website was opened directly using the S3 static website endpoint.

A test contact form submission successfully travelled through:

```text
S3 → API Gateway → Lambda → API Gateway → Browser
```

and displayed the success message.

Therefore, the complete application workflow was successfully verified.

---

# 13. Security Considerations

Several basic security practices were applied.

### Input Validation

Input is validated both:

- On the frontend
- On the Lambda backend

This prevents invalid requests from being blindly processed.

### CORS

CORS was configured to allow the deployed frontend to communicate with the API.

### S3 Permissions

The S3 bucket allows public read access only for website objects.

Users do not receive permissions to modify or delete the bucket contents.

### No Sensitive Data

The static website contains no:

- AWS credentials
- API keys
- Passwords
- Private credentials
- Sensitive configuration

### Least Privilege

The Lambda execution role uses basic execution permissions rather than unnecessary administrator permissions.

---

# 14. Cost Considerations

The application uses a serverless architecture and does not require an always-running EC2 server.

The main AWS components are:

```text
Amazon S3
API Gateway
AWS Lambda
CloudWatch
```

For a small internship project with low traffic, resource usage should remain low. AWS pricing and free-tier eligibility can change, so actual costs should be monitored through the AWS Billing/Cost Management console.

To avoid unnecessary charges:

- Do not create unused EC2 instances.
- Do not leave unnecessary resources running.
- Avoid storing large files in S3.
- Monitor Lambda and API usage.
- Delete the resources after the internship assignment if they are no longer required.

---

# 15. Challenges Encountered and Solutions

### Challenge 1 — Lambda returned the default response

Initially, Lambda returned:

```text
Hello from Lambda!
```

This occurred because the default Lambda code had not yet been replaced.

**Solution:** The Lambda function was updated with custom request validation and response logic.

### Challenge 2 — Lambda returned "Request body is required"

The Lambda console test was initially given the JSON object directly instead of placing it inside the expected `event.body`.

**Solution:** The Lambda test event was changed to:

```json
{
  "body": "{\"name\":\"Amarjit\",\"email\":\"test@example.com\",\"message\":\"Hello from AWS Lambda\"}"
}
```

### Challenge 3 — Browser could not connect to API

The API worked from PowerShell but the browser could not submit the form.

**Cause:** CORS had not been configured in API Gateway.

**Solution:** CORS was configured to allow the required origin, headers, and methods.

### Challenge 4 — S3 Website Access

The S3 website initially required appropriate public-read configuration.

**Solution:** Static website hosting was enabled and an appropriate bucket policy was configured to allow public retrieval of website objects.

---

# 16. Final Architecture

The completed application can be summarized as:

```text
                       ┌───────────────┐
                       │     User      │
                       │   Browser     │
                       └───────┬───────┘
                               │
                               ▼
                       ┌───────────────┐
                       │   Amazon S3   │
                       │ Static Website│
                       └───────┬───────┘
                               │
                         POST /contact
                               │
                               ▼
                       ┌───────────────┐
                       │ API Gateway   │
                       │   HTTP API    │
                       └───────┬───────┘
                               │
                               ▼
                       ┌───────────────┐
                       │ AWS Lambda    │
                       │   Validation  │
                       │   Processing  │
                       └───────┬───────┘
                               │
                               ▼
                       ┌───────────────┐
                       │  CloudWatch   │
                       │     Logs      │
                       └───────────────┘
```

---

# 17. Learning Outcomes

Through this project, the following AWS and cloud concepts were demonstrated:

- Static website deployment
- Amazon S3 bucket configuration
- S3 static website hosting
- Bucket policies
- HTTP APIs
- API Gateway routes
- AWS Lambda functions
- Serverless architecture
- IAM execution roles
- CORS configuration
- Client-side validation
- Server-side validation
- CloudWatch logging
- API testing
- Basic cloud security
- Cost-conscious cloud deployment

---

# 18. Conclusion

The project successfully implements a small serverless web application using AWS.

The static frontend is hosted on Amazon S3, while API Gateway provides the HTTP interface for the contact form. AWS Lambda performs backend validation and processing, and CloudWatch provides basic execution monitoring.

The final architecture avoids the need for traditional always-running servers and demonstrates how multiple AWS managed services can be combined to build a lightweight, scalable cloud application.

The application was successfully tested from the deployed S3 website, confirming that the complete frontend-to-backend workflow is operational.

**Project Status: Successfully Completed ✅**