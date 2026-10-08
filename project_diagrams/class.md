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
        +applyForAdmission()
        +uploadDocument()
        +checkStatus()
    }

    class AdmissionOfficer {
        -int officerId
        -String department
        +verifyDocuments()
        +approveApplication()
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
        -Date uploadDate
        +verify()
    }

    class Payment {
        -int paymentId
        -double amount
        -String transactionId
        +processPayment()
    }

    User <|-- Student
    User <|-- AdmissionOfficer
    
    Student "1" --> "*" Application : submits
    Application "1" *-- "*" Document : contains
    Application "1" --> "1" Payment : requires
    AdmissionOfficer "1" --> "*" Application : reviews