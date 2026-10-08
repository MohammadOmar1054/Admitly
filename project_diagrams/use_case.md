```mermaid
flowchart LR
    %% Actors
    Student(["👤 Student"])
    Admin(["👤 Admission Admin"])

    %% System Boundary
    subgraph System ["Online Admission Submission System"]
        direction TB
        UC1(["Register / Login"])
        UC2(["Submit Application"])
        UC3(["Upload Documents"])
        UC4(["Pay Application Fee"])
        UC5(["Track Application Status"])
        UC6(["Review Application"])
        UC7(["Verify Documents"])
        UC8(["Approve / Reject Admission"])
        UC9(["Send Email Notifications"])
    end

    %% Relationships
    Student --> UC1
    Student --> UC2
    Student --> UC3
    Student --> UC4
    Student --> UC5

    Admin --> UC1
    Admin --> UC6
    Admin --> UC7
    Admin --> UC8

    UC2 -.->|include| UC3
    UC8 -.->|include| UC9