import { LightningElement, wire } from 'lwc';
import getAllDebts from '@salesforce/apex/debtItemController.getAllDebts';
import deleteDebt from '@salesforce/apex/debtItemController.deleteDebt';
import DEBT_OBJECT from '@salesforce/schema/Debt__c';
import DEBT_NAME from '@salesforce/schema/Debt__c.Name';
import FIRST_NAME from '@salesforce/schema/Debt__c.FirstName__c';
import LAST_NAME from '@salesforce/schema/Debt__c.LastName__c';
import MIN_PAY from '@salesforce/schema/Debt__c.MinPaymentPercentage__c';
import BALANCE from '@salesforce/schema/Debt__c.Balance__c';

export default class DebtItemsWithApex extends LightningElement {
    debts = [];
    showRecords = false;
    columns;
    count;
    totalAmount = 0;
    selectedRecords = 0;
    selectedRecordToRemove = [];
    openModal = false;
    objectApiName = DEBT_OBJECT;
    fields = [DEBT_NAME, FIRST_NAME, LAST_NAME, MIN_PAY, BALANCE];

    /**
     * Below @wire decorator is used to get the debt records
     */
    @wire(getAllDebts)
    getAllDebtResult({ error, data }) {
        if(data) {
            // Data handling
            this.debtData(data);
        } else if(error) {
            // Error handling
            console.error('Error ==> '+JSON.stringify(error));
        }
    }

    /**
     * connectedCallback is executed when the component is inserted into DOM. Connected callback runs once when the component is inserted.
     */
    connectedCallback() {
        let executed = false;
        setInterval(() => {
            if(!executed) {
                executed = true;
                this.calculateBalance();
            }
        }, 1000 * 1);
    }

    /**
     * Below method is used to display the data in a table
     */
    debtData(records) {
        if(records) {
            this.showRecords = true;
            this.debts = records;
            this.count = records.length;
            const fields = [
                {label: 'Creditor', fieldName: 'creditorName', type: 'text'},
                {label: 'First Name', fieldName: 'firstName', type: 'text'},
                {label: 'Last Name', fieldName: 'lastName', type: 'text'},
                {label: 'Min Pay %', fieldName: 'minPaymentPercentage', type: 'text'},
                {label: 'Balance', fieldName: 'balance', type: 'currency'}
            ];
            this.columns = fields;
        }
    }

    /**
     * Below function is used to get the selected records
     */
    getSelectedRow(event) {
       const selectedRow = event.detail.selectedRows;
       const setRows = [];
       this.selectedRecords = selectedRow.length;
       for (let i = 0; i < selectedRow.length; i++) {
           setRows.push(selectedRow[i]);   
       }
       this.selectedRecordToRemove = setRows;
    }

    /**
     * Below method is used to remove the debt record(s)
     */
    removeDebt() {
        const selectedDebtRecord = this.selectedRecordToRemove;
        if(selectedDebtRecord !== 0) {
          deleteDebt({
              payload: JSON.stringify(selectedDebtRecord)
          })
          .then(Response => {
              location.reload();
          })
          .catch(Error => {
              console.error('Error in deleting records ==> '+JSON.stringify(Error));
          })
        }
    }

    /**
     * Below method is used to open pop-up modal
     */
    addDebt() {
        this.openModal = true;
    }

    /**
     * Below method is used to save the debt record
     */
    handleSave(event) {
        this.openModal = false;
        location.reload();
    }

    /**
     * Below method is used to close the modal-box
     */
    handleCancel(event) {
       this.openModal = false;
    }

    /**
     * Below method is used to call the balance
     */
    calculateBalance() {
        this.debts.forEach(element => {
            this.totalAmount += parseFloat(element.balance);
        });
    }
}