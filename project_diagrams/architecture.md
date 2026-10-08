flowchart TD
    subgraph Presentation ["Presentation Layer"]
        Web[Web Browser]
        Mobile[Mobile App]
    end

    subgraph Business ["Business Logic Layer"]
        API[API Gateway]
        AC[Admission Controller]
        VM[Verification Module]
        PM[Payment Module]
    end

    subgraph DataLayer ["Data Layer"]
        RDB[(Relational DB\nMySQL/PostgreSQL)]
        DocStore[(Document Store\nAWS S3/Firebase)]
    end

    Web --> API
    Mobile --> API
    
    API --> AC
    API --> VM
    API --> PM

    AC --> RDB
    VM --> DocStore
    VM --> RDB
    PM --> RDB