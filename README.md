# WEB APPLICATION
# RESTful API Requirements
demo
All API request/response payloads should be in JSON format.
No user interface (UI) should be implemented for the application.
Ensure proper HTTP status codes for API calls.
Maintain high code quality using unit and/or integration tests.


# Bootstrapping Database
The application should automatically bootstrap the database at startup.
Bootstrapping involves creating the schema, tables, indexes, sequences, etc., or updating them if their definition has changed.
Manual setup of the database using SQL scripts is not allowed.
ORM frameworks like Hibernate (for Java), SQLAlchemy (for Python), and Sequelize (for Node.js) are recommended.
# Users & User Accounts
Account information is loaded from a CSV file located at /opt/user.csv.
The application loads the file at startup and creates users based on the information in the CSV file.
New user accounts are created if they do not exist.
User passwords must be hashed using BCrypt before storing them in the database.
Users cannot set values for account_created and account_updated.
# Authentication Requirements
Users must provide a basic authentication token when making API calls to authenticated endpoints.
The web application should support Token-Based authentication (not Session Authentication).
# API Implementation
Authenticated users can create assignments.
Assignment points must be between 1 and 10.
Only the user who created the assignment can update or delete it.
Users should not be able to set values for assignment_created and assignment_updated.
# Continuous Integration (CI) with GitHub Actions
When a pull request is raised, this GitHub Actions workflow should do the following:
Run the packer fmt command. If this command modifies the packer template, the workflow should fail and prevent users from merging the pull request.
Run the packer validate command. If this command fails to validate the packer template, the workflow should fail and prevent users from merging the pull request.
When a pull request is merged, this GitHub Actions workflow should be triggered to do the following:
Run the integration test.
Build the application artifact (war, jar, zip, etc.). This artifact should be build on the GitHub actions runner and not in the AMI i.e. do not git clone your repository in the packer template and then build it. You will build the artifact on the runner and copy it into the AMI.
Build the AMI with application dependencies and set up the application by copying the application artifacts and the configuration files.
The AMI built must be shared with the DEMO account.
No AMI should be built if the any of the jobs or steps in the workflow fail.
# Implement integration tests for the /healthz endpoint.
Tests should verify success criteria.
GitHub Actions should set up  PostgreSQL instance and provide configuration to the application to connect to it.

