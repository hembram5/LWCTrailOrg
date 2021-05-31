public with sharing class debtItemController {
    
    /**
     * Below is the inner class with public variable
     */
    class debtVariable {
        @AuraEnabled
        public string recordId;
        @AuraEnabled
        public string creditorName;
        @AuraEnabled
        public string firstName;
        @AuraEnabled
        public string lastName;
        @AuraEnabled
        public string minPaymentPercentage;
        @AuraEnabled
        public string balance;
    }

    /**
     * Below method is used to return DEBT
     */
    public static List<debtVariable> getDebts(List<SObject> objectInstance) {
        List<debtVariable> debts = new List<debtVariable>();
        for (SObject iVar : objectInstance) {
            debtVariable debtVar = new debtVariable();
            debtVar.recordId = iVar.Id;
            debtVar.creditorName = String.valueOf(iVar.get('Name'));
            debtVar.firstName = String.valueOf(iVar.get('FirstName__c'));
            debtVar.lastName = String.valueOf(iVar.get('LastName__c'));
            debtVar.minPaymentPercentage = String.valueOf(iVar.get('MinPaymentPercentage__c'));
            debtVar.balance = String.valueOf(iVar.get('Balance__c'));
            debts.add(debtVar);
        }
        return debts;
    }

    /**
     * Below method is used to get all debt records
     */
    @AuraEnabled(cacheable = true)
    public static List<debtVariable> getAllDebts() {
        List<SObject> debtRecords = Database.query(
            'SELECT Id, Name, FirstName__c, LastName__c, MinPaymentPercentage__c, Balance__c FROM Debt__c'
        );
        return getDebts(debtRecords);
    }

    /**
     * Below method is used to delete the debt record(s)
     */
    @AuraEnabled
    public static void deleteDebt(String payload) {
        List<debtVariable> payloadObject = (List<debtVariable>)JSON.deserialize(payload, List<debtVariable>.Class);
        List<Debt__c> removeDebt = new List<Debt__c>();
        for (debtVariable iDebt : payloadObject) {
            Debt__c debtRecord = new Debt__c();
            debtRecord.Id = iDebt.recordId;
            removeDebt.add(debtRecord);
        }

        if (!removeDebt.isEmpty()) {
            delete removeDebt;
        }
    }
}