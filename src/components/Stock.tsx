import axios from "axios";
import React, { ChangeEvent, FormEvent, useEffect, useState} from "react";
import { useNavigate } from "react-router-dom";
interface StockItem{
    id:string;
    name:string;
    category:string;
    description?:string;
    availableQty:number;
    minQty:number;
    unitPrice:number;
    supplier?: string;
    lastUpdated?: string;
}
const Stock : React.FC =() =>{
    const [state,setState] = useState<StockItem[]>([])
    const [error,setError] = useState<string>("");
    const [success,setSuccess] = useState<string>("");
    const navigate = useNavigate();


    //purchase form
    const [showPurchaseForm,setShowPurchaseForm] = useState<boolean>(false);
    const [selectedItem,setSelectedItem] = useState<StockItem|null>(null); //store selected item for purchase
    const [purchaseQty,setPurchaseQty] = useState<string>(""); // to store purchase quantity entered by user
    const [purchaseError,setPurchaseError] = useState<string>("");

    useEffect(()=>{
        fetchStock();
    },[]);

const fetchStock = async()=>{
    try{
        await axios.get("http://localhost:3001/stocks")
        .then(res=>{
        const numericData = res.data.map((item: StockItem) => ({
            ...item,
            availableQty: Number(item.availableQty),
            minQty: Number(item.minQty),
            unitPrice: Number(item.unitPrice)
            }));
            setState(res.data);
            setSuccess("data fetched");
        
    })
    .catch(err=>setError("couldn't fetch data"))
    }catch(err){
        setError("wrong data");
    }
}

const handleEdit = (id:string)=>{
    navigate("/edit/"+id)
}
const handleDelete = async(item:StockItem) =>{
        await axios.delete(`http://localhost:3001/stocks/${item.id}`)
        .then(res=>{
            const response = res.data;
            console.log("sfdg",res.data)
            const filteredlist = state.filter(e=>e.id !== response.id)
            setState(filteredlist);
            setSuccess("item deleted")
        })
        .catch(err=>setError("error while deleting"))
    
}
// click to show purchase form
const handlePurchaseClick = (item:StockItem) =>{
    setSelectedItem(item);
    setShowPurchaseForm(true);
    setPurchaseQty('');
    setPurchaseError('');
}
//cancel for purchase
const handleCancelPurchase = ()=>{
    setShowPurchaseForm(false);
    setSelectedItem(null);
    setPurchaseQty('');
    setPurchaseError('');
}
// function to validate input in purchase
const handleChange = (e:ChangeEvent<HTMLInputElement>) =>{
    setPurchaseQty(e.target.value); //updates purchase quantity
    setPurchaseError('');
}

//handle submisssion
const handleSubmit = async (e:FormEvent<HTMLFormElement>) =>{
    e.preventDefault();

    if(!purchaseQty){
        setPurchaseError("Please enter purchase quantity");
        return;
    }
    const quantity = Number(purchaseQty);
    if(isNaN(quantity) || quantity <= 0){
        setPurchaseError("Purchase quantity must be greater than 0");
        return;
    }
    //to find selected item from stock
    if(!selectedItem){
        setPurchaseError("cannot find selected item");
        return;
    }
    if(selectedItem && quantity > selectedItem.availableQty){
        setPurchaseError("cannot purchase quantity more than available quatity "+selectedItem.availableQty);
        return;
    }

   
    try{
        const newQty = selectedItem.availableQty - quantity;

        await axios.put('http://localhost:3001/stocks/'+selectedItem.id,{
           ...selectedItem,
            availableQty : newQty,
            lastUpdated: new Date().toISOString().split('T')[0]
        });

        setState(state.map(stock=>
            stock.id === selectedItem.id ? {...stock,availableQty : newQty} : stock
        ))
        setSuccess("Purchase successful! Quantity updated.")
        setShowPurchaseForm(false);
        setSelectedItem(null);
        setPurchaseQty('');
        setPurchaseError('');
    }
    catch(err){
        setPurchaseError('Failed to process patch');
    }
}





    return(
        <div className="container-fluid">
            {error && <div className="text-danger">{error}</div>}
            {success && <div className="text-success">{success}</div>}

            <div className="flex" style={{justifyContent:"space-between", alignItems:"center",marginBottom:"30px"}}>
                <button className="btn btn-primary" onClick ={()=> navigate("/add")}>
                    Add new Item
                </button>
            </div>
            {state.length === 0 ? (<div className="emp" style={{color:"#6c757d",fontSize:"16px",margin:"0"}}>
                <p>No stock items found. Add your first item to get started!</p>
            </div>) : (
                <table className="table">
                    <thead>
                        <tr>
                        <th>Item Name</th>
                        <th>Category</th>
                        <th>Available Qty</th>
                        <th>Minimum Qty</th>
                        <th>Unit Price</th>
                        <th></th>
                        <th>Actions</th>
                        <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {state.map((item)=>{
                            // const qty  = Number(item.availableQty)  >= Number(item.minQty) ;
                            // const bg = qty ? "red" : "";
                            // const cellStyle = {backgroundColor : bg}
                            const isLow = item.availableQty <= item.minQty;
                            const rowStyle = isLow ? { backgroundColor: "red" } : {};
                            console.log("QTY CHECK:", item.name, item.availableQty, item.minQty, typeof item.availableQty, typeof item.minQty);

                                return(
                                    <tr key={item.id}>
                                        <td style={rowStyle}>{item.name}</td>
                                        <td style={rowStyle}>{item.category}</td>
                                        <td style={rowStyle}>{item.availableQty}</td> 
                                        <td style={rowStyle}>{item.minQty}</td>
                                        <td style={rowStyle}>{item.unitPrice}</td>
                                        <td style={rowStyle}><button className="btn btn-primary" onClick={()=> handleEdit(item.id)}>
                                            Edit
                                            </button>
                                        </td>
                                        <td style={rowStyle}><button className="btn btn-primary" onClick={()=> handleDelete(item)}>
                                            Delete
                                            </button>
                                        </td>
                                        <td style={rowStyle}>
                                            <button  className="btn btn-primary" onClick={()=>handlePurchaseClick(item)}>
                                                Purchase
                                                
                                            </button>
                                        </td>
                                    </tr>
                                )
                        })}
                    </tbody>
                </table>
            )}
        {showPurchaseForm && selectedItem && (
            <div>
                <h2>Purchase Item</h2>
                <form onSubmit={handleSubmit}>
                    <div>
                  <strong>Selected Item:</strong> {selectedItem.name}<br />
                  <strong>Available Quantity:</strong> {selectedItem.availableQty}<br />
                  <strong>Unit Price:</strong> {selectedItem.unitPrice}
                </div>
                <div className="form-group">
                    <label>Purchase Quantity</label>
                    <input
                    type="number"
                    value={purchaseQty}
                    onChange={handleChange}
                    placeholder="Enter quantity"
                    min = "1"
                    />
                    {purchaseError && <div >{purchaseError}</div>}

                    <div>
                        <button type="submit"> Confirm Purchase</button>
                        <button type="button" onClick={handleCancelPurchase}>Cancel</button>
                    </div>

                </div>
                </form>
            </div>
        )}
        </div>

        
    )
}
export default Stock;