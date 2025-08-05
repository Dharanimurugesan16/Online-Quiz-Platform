
#!/bin/bash

# Create unique database name from request ID
DATABASE_NAME="285c0d61_b834_4365_ab30_785ce62faa94"

# Project output directory
OUTPUT_DIR="/home/coder/project/workspace/question_generation_service/solutions/285c0d61-b834-4365-ab30-785ce62faa94/springapp"

# Spring CLI command to generate project
spring init \
    --type=maven-project \
    --language=java \
    --boot-version=3.4.0 \
    --packaging=jar \
    --java-version=17 \
    --groupId=com.examly \
    --artifactId=springapp \
    --name="Quiz Management System" \
    --description="Interactive Quiz Management System with Spring Boot" \
    --package-name=com.examly.springapp \
    --dependencies=web,data-jpa,validation,mysql,lombok \
    --build=maven \
    ${OUTPUT_DIR}

# Wait for project generation to complete
sleep 2

# Create database
mysql -u root -pexamly -e "CREATE DATABASE IF NOT EXISTS ${DATABASE_NAME};" 2>/dev/null || echo "Database creation failed, will use default"

# Configure application.properties
cat > "${OUTPUT_DIR}/src/main/resources/application.properties" << EOL
spring.datasource.url=jdbc:mysql://localhost:3306/${DATABASE_NAME}?createDatabaseIfNotExist=true
spring.datasource.username=root
spring.datasource.password=examly
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQLDialect

# Server configuration
server.port=8080
server.error.include-message=always
server.error.include-binding-errors=always

# Logging configuration
logging.level.org.springframework.web=INFO
logging.level.org.hibernate=ERROR
EOL

# Update pom.xml with additional dependencies
sed -i '/<dependencies>/a\
        <dependency>\
            <groupId>org.springframework.boot</groupId>\
            <artifactId>spring-boot-starter-validation</artifactId>\
        </dependency>' "${OUTPUT_DIR}/pom.xml"

echo "Spring Boot project generated successfully in ${OUTPUT_DIR}"
