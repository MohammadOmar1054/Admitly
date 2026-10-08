flowchart TD
    Start((Start)) --> Visit[Visit Admission Portal]
    Visit --> Login[Register / Login]
    Login --> CheckReg{Already Registered?}
    
    CheckReg -- Yes --> FillForm[Fill Application Form]
    CheckReg -- No --> CreateAcc[Create Account]
    CreateAcc --> FillForm
    
    FillForm --> Upload[Upload Required Documents]
    Upload --> Pay[Pay Application Fee]
    Pay --> CheckPay{Payment Successful?}
    
    CheckPay -- No --> PayError[Show Payment Error]
    PayError --> End((End))
    
    CheckPay -- Yes --> Submit[Submit Application]
    Submit --> GenID[System Generates Application ID]
    
    GenID --> Fork1[Student Tracks Status]
    GenID --> Fork2[Officer Verifies Documents]
    
    Fork2 --> CheckDocs{Documents Valid?}
    
    CheckDocs -- Yes --> Approve[Approve Application]
    Approve --> Merit[Generate Merit List]
    Merit --> Offer[Send Admission Offer]
    
    CheckDocs -- No --> Reject[Reject / Request Re-upload]
    Reject --> Notify[Notify Student]
    
    Offer --> Accept[Student Accepts Offer]
    Accept --> Confirm[Admission Confirmed]
    Confirm --> End