flowchart TD
    Start((Start)) --> Visit[Visit Admission Portal]
    Visit --> Login[Login / Register]
    Login --> FillForm[Fill Admission Form]
    FillForm --> UploadDocs[Upload Required Documents]
    UploadDocs --> PayFee[Pay Application Fee]
    PayFee --> CheckPay{Payment Successful?}
    
    CheckPay -- No --> PayError[Show Payment Error]
    PayError --> End((End))
    
    CheckPay -- Yes --> Submit[Submit Application]
    Submit --> Review[Admin Reviews Application]
    Review --> Verify{Documents Valid?}
    
    Verify -- Yes --> Approve[Approve Admission]
    Approve --> Notify[Send Approval Email]
    Notify --> End
    
    Verify -- No --> Reject[Reject / Request Re-upload]
    Reject --> NotifyReject[Send Rejection Email]
    NotifyReject --> End