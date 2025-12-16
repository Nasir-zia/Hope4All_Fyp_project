# Chapter 3: Requirements Specification

## 3.1 Introduction
This system is designed to assist in managing and supporting orphans via a comprehensive platform involving multiple user roles including admin, donors, volunteers, and orphanage staff. It provides functionalities such as user registration and authentication, orphan registration and profile management, messaging, inventory, and request/task management. The system integrates hardware and software components to deliver an online interface accessible through desktop and mobile platforms, ensuring a seamless user experience.

## 3.2 Interface Requirements

This section details the mandatory requirements for the system to interface different components and communicate effectively with the environment, covering hardware and software aspects necessary for the system's operation.

### 3.2.1 Hardware Interface Requirements

- The system will interface with end-user devices including smartphones and tablets running Android and iOS.
- These devices are expected to have hardware features such as:
  - Camera for capturing profile photos or identity documents.
  - Network interfaces supporting Wi-Fi or cellular data for connectivity.
- Desktop or laptop computers with internet access will interface via web browsers for administrative or monitoring functions.
- Server hardware hosting the backend services must support Node.js runtime and have sufficient processing power and storage to handle application logic and database operations.
- Cloud infrastructure components such as cloud storage for images and documents accessed via APIs.

### 3.2.2 Software Interface Requirements

- The client applications on mobile and web platforms communicate with the backend through well-defined RESTful APIs over HTTP/HTTPS protocols.
- User authentication and authorization implemented using JWT (JSON Web Tokens) to provide secure access control.
- The system integrates with third-party cloud services such as Cloudinary for media storage and retrieval.
- Backend software uses Node.js environment with Express.js framework, with MongoDB as the database for data persistence.
- Environmental variables and configuration files store sensitive credentials such as JWT secret keys and cloud storage API keys.
- The software interfaces adhere to standard JSON data formats for request and response payloads to ensure interoperability.

## 3.3 Functional Requirements
- **User Management:** Users can register an account, login, and manage profiles. Roles supported include admin, donor, volunteer, and orphanage staff.
- **Orphan Registration and Profile:** Authorized users can register orphans, uploading personal details, profile pictures, and supporting documentation.
- **Messaging:** Users can send and receive messages within the system for communication.
- **Inventory and Requests:** Management of inventory related to orphan care and handling requests for supplies or assistance.
- **Task Management:** Assigning and tracking tasks related to orphan care and administrative responsibilities.
- **Security:** Password hashing and token-based authentication ensure data security.

## 3.4 Use Case Model
Key use cases by user role include:
- **Admin:** Manage users, oversee system operations.
- **Donor:** Register, make donations, track donation history.
- **Orphanage Staff:** Register orphans, manage profiles, handle messages and requests.
- **Volunteer:** Access assigned tasks, communicate with other users.

### 3.4.1 Use Case Diagrams

Here are textual Mermaid diagrams representing the key use cases:

```mermaid
usecaseDiagram
    actor Admin
    actor Donor
    actor OrphanageStaff as Staff
    actor Volunteer

    Admin --> (Manage Users)
    Admin --> (Oversee Operations)

    Donor --> (Register Account)
    Donor --> (Make Donation)
    Donor --> (Track Donation History)

    Staff --> (Register Orphan)
    Staff --> (Manage Orphan Profiles)
    Staff --> (Handle Messages)
    Staff --> (Handle Requests)

    Volunteer --> (Access Assigned Tasks)
    Volunteer --> (Communicate with Users)
```

## 3.5 Use Cases

    Volunteer --> (Communicate with Users)

### 3.5.1 User Registration
- **Description:** Allow new users to create accounts by providing username, email, password, and role.
- **Actors:** Anyone wishing to use the system.
- **Trigger:** User submits registration form.
- **Preconditions:** Email and username must be unique.
- **Postconditions:** User account is created, hashed password is stored securely.

### 3.5.2 User Login
- **Description:** Authenticate users via email and password.
- **Actors:** Registered users.
- **Trigger:** User submits login credentials.
- **Postconditions:** User receives JWT token for session management.

### 3.5.3 Orphan Registration
- **Description:** Add new orphan records with personal data and required documents.
- **Actors:** Orphanage staff.
- **Trigger:** Staff fills and submits orphan registration form.
- **Postconditions:** Orphan data saved in the system, files uploaded to cloud.

### 3.5.n Additional Use Cases
- Messaging between users.
- Inventory management.
- Request handling.
- Task assignment and tracking.

## 3.6 Non-functional Requirements

### 3.6.1 Performance
- The system shall provide responses within 3 seconds under typical usage loads.
- Real-time messaging updates.

### 3.6.2 Reliability
- The system shall be available 99.5% of the time.
- Proper error handling and data validation in place.

### 3.6.3 Security
- Passwords hashed with bcrypt.
- JWT-based authentication with secure token storage.
- Role-based access control.

### 3.6.4 Consistency
- Database transactions ensure data integrity.
- Consistent user experience across platforms.

## 3.7 Resource Requirements

### Equipment
- Mobile devices capable of running Android/iOS apps.
- Backend server environment setup (Node.js, MongoDB).
- Cloud service account for file storage (Cloudinary).

### Funds
- Optional budget allocation for cloud services and server hosting.

### Human Effort
- Project team includes backend developers, frontend developers, testers.
- Task division across features: authentication, orphan management, messaging.

## 3.8 Database Requirements
- Collections for Users, Orphans, Donations, Messages, Inventory, Requests, Tasks.
- Data models include necessary fields for user roles, orphan profiles, etc.
- Secure database connection configuration.

## 3.9 Project Feasibility

### 3.9.1 Technical Feasibility
- Utilizes widely supported technologies (Node.js, Flutter, MongoDB).
- Cloudinary for scalable file management.
- Compatible with desktops, web, and mobile platforms.

### 3.9.2 Operational Feasibility
- Interfaces designed for ease of use by target users.
- Business processes modeled in use cases align with user needs.

### 3.9.3 Legal & Ethical Feasibility
- Complies with state regulations regarding user data and child protection.
- Data privacy maintained through secure authentication and authorization.
- System is aimed at social welfare, ensuring ethical use.

## 3.10 Summary
This requirements specification defines the interfaces, functions, and constraints for the orphan support management system. It details hardware and software interfaces, describes use cases supporting all user roles, and outlines non-functional needs to ensure a secure, reliable, and performant system. The project is feasible technically, operationally, and ethically, utilizing current technologies to deliver a robust platform.
