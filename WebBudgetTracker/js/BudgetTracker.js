export default class BudgetTracker{
    constructor(querySelectorString)
    {
      this.root=document.querySelector(querySelectorString);
      this.root.innerHTML=BudgetTracker.html();

      this.root.querySelector(".new-entry").addEventListener("click",()=>{this.onNewEntryBtnClick();});


      this.load();
    }


    static html()
    {
       return`
       <table class="budget-tracker">
       <thead>
           <tr>
               <th>Date</th>
               <th>Type</th>
               <th>Description</th>
               <th>Amount</th>
               <th>Action</th>
           </tr>
        </thead>
       <tbody class="entries"><tbody>
       
       </tbody>
       <tfoot class="sum">
       <tr> <td colspan="5">
            <button class="new-entry" type="button">New Entry</button>
              </td></tr>
           <tr>   
               <td colspan="5" class="summary">
                   <strong style="font:bold :">Total:</strong>
                   <span class="total">₹0.00</span>
               </td>
           </tr>
       </tfoot>
   </table>
       
   `;   
    }
    static entryHtml()
    {
        return ` <tr>
        <td>
          <input class="input input-date" type="date">   
        </td>
        <td>
            <select class="input input-type">
                <option value="income">Income</option>
                <option value="expense">Expense</option>
                <option value="expense">Rent/Bill</option>
                <option value="expense">Insurance</option>
                <option value="expense">Medical</option>
                <option value="expense">Entertainment</option>
                <option value="expense">Other</option>
            </select>
        </td>
        <td>
          <input class="input input-description" type="text" placeholder="Add Description">   
        </td>
        <td>
            <input class="input input-amount" type="number">   
        </td>
        <td>
            <button class="delete-entry">Delete</button>   
        </td>
       </tr> `;
    }

    load()
    {
       const entries=JSON.parse(localStorage.getItem("budget-tracker-entries-dev") || "[]");
       for(const entry of entries)
       {
        this.addEntry(entry);
       }
       
       this.updateSummary();
    }

    updateSummary()
    {
        const total=this.getEntryRows().reduce((total,row) =>{
            const amount=row.querySelector(".input-amount").value;
            const isExpense=row.querySelector(".input-type").value==="expense";
            const modifier=isExpense?-1:1;
            return total +(amount*modifier);
        },0);
        const totalFormatted = new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "INR"
        }).format(total);

        this.root.querySelector(".total").textContent = totalFormatted;
    }
  
    save()
    {
        const data=this.getEntryRows().map(row =>{return {
                date: row.querySelector(".input-date").value,
                description: row.querySelector(".input-description").value,
                type: row.querySelector(".input-type").value,
                amount: parseFloat(row.querySelector(".input-amount").value),
        };});

        localStorage.setItem("budget-tracker-entries-dev", JSON.stringify(data));
        this.updateSummary();
    }

    addEntry(entry={})
    {
      this.root.querySelector(".entries").insertAdjacentHTML("beforeend",BudgetTracker.entryHtml());
      const row =this.root.querySelector(".entries tr:last-of-type");
      row.querySelector(".input-date").value=entry.date || new Date().toISOString().replace(/T.*/,"");
      row.querySelector(".input-description").value=entry.description || "";
      row.querySelector(".input-type").value=entry.type || "income";
      row.querySelector(".input-amount").value=entry.amount || 0;
      row.querySelector(".delete-entry").addEventListener("click",e=>{this.onDeleteEntryBtnClick(e);});
      row.querySelectorAll(".input").forEach(input =>{input.addEventListener("change",()=>this.save());});
     
    }
    
    getEntryRows()
    {
       return Array.from(this.root.querySelectorAll(".entries tr"));
    }

    onNewEntryBtnClick()
    {
      this.addEntry();
    }

    onDeleteEntryBtnClick(e)
    {
      e.target.closest("tr").remove();
      this.save();
    }

  
}






