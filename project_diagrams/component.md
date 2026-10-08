flowchart TD
    subgraph Frontend ["Frontend (Web/Mobile)"]
        SP[Student Portal]
        AD[Admin Dashboard]
    end

    subgraph Backend ["Backend Services"]
        Auth[Authentication Service]
        AppServ[Application Service]
        DocServ[Document Verification Service]
        PayServ[Payment Gateway Integration]
        Notif[Notification Service]
    end

    subgraph Data ["Database"]
        SDB[(Student DB)]
        ADB[(Application DB)]
        DS[(Document Storage)]
    end

    SP --> Auth
    SP --> AppServ
    SP --> PayServ
    
    AD --> DocServ
    AD --> AppServ

    AppServ --> SDB
    AppServ --> ADB
    DocServ --> DS
    Notif --> SP