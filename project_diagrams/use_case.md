flowchart LR
    %% Actors
    Student(["👤 Student"])
    Officer(["👤 Admission Officer"])

    %% System Boundary
    subgraph System ["Online Admission Management System"]
        direction TB
        UC1(["Register / Login"])
        UC2(["Fill Application Form"])
        UC3(["Upload Documents"])
        UC4(["Pay Application Fee"])
        UC5(["Track Application Status"])
        UC6(["Verify Documents"])
        UC7(["Review Application"])
        UC8(["Generate Merit List"])
        UC9(["Send Notifications"])
    end

    %% Relationships
    Student --> UC1
    Student --> UC2
    Student --> UC3
    Student --> UC4
    Student --> UC5

    Officer --> UC1
    Officer --> UC6
    Officer --> UC7
    Officer --> UC8

    UC3 -.->|include| UC4
    UC8 -.->|include| UC9