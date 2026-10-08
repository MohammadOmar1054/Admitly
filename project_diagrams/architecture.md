```mermaid
flowchart TD
    subgraph Presentation ["Presentation Layer"]
        Web[Web Browser]
    end

    subgraph Business ["Business Logic Layer"]
        API[API Gateway]
        AC[Admission Controller]
        VM[Verification Module]
        PM[Payment Module]
    end

    subgraph DataLayer ["Data Layer"]
        RDB[(Relational DB\nMySQL)]
        DocStore[(Document Storage\nLocal / Cloud)]
    end

    Web --> API
    
    API --> AC
    API --> VM
    API --> PM

    AC --> RDB
    VM --> DocStore
    VM --> RDB
    PM --> RDB