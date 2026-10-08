```mermaid
classDiagram
    class User {
        -int userId
        -String name
        -String email
        -String password
        +login()
        +logout()
    }

    class Student {
        -int studentId
        -String phone
        -String address
        +submitApplication()
        +uploadDocument()
        +checkStatus()
    }

    class Admin {
        -int adminId
        -String department
        +reviewApplication()
        +verifyDocuments()
    }

    class Application {
        -int applicationId
        -String status
        -Date submissionDate
        +submit()
        +updateStatus()
    }

    class Document {
        -int documentId
        -String fileName
        -String fileType
        +verify()
    }

    class Payment {
        -int paymentId
        -double amount
        -String transactionId
        +processPayment()
    }

    User <|-- Student
    User <|-- Admin
    
    Student "1" --> "*" Application : submits
    Application "1" *-- "*" Document : contains
    Application "1" --> "1" Payment : requires
    Admin "1" --> "*" Application : reviews