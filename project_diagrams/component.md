flowchart TD
    subgraph Frontend ["Frontend (Web App)"]
        SP[Student Portal]
        AD[Admin Dashboard]
    end

    subgraph Backend ["Backend Services"]
        Auth[Authentication Service]
        AppServ[Application Service]
        DocServ[Document Service]
        PayServ[Payment Gateway]
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
    SP --> DocServ
    
    AD --> AppServ
    AD --> DocServ

    AppServ --> SDB
    AppServ --> ADB
    DocServ --> DS
    Notif --> SP