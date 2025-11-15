import axios from "axios";
import React, { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

interface FormErrors {
  name?: string;
  category?: string;
  availableQty?: string;
  minQty?: string;
  unitPrice?: string;
}
interface valid {
    name: boolean,
    category: boolean,
    description: boolean,
    availableQty: boolean,
    minQty: boolean,
    unitPrice: boolean,
    supplier: boolean
}
const EditStock : React.FC = () =>{
    const [formData,setFormData] = useState({
    name: '',
    category: '',
    description: '',
    availableQty: '',
    minQty: '',
    unitPrice: '',
    supplier: ''
    })
    const [error,setError] = useState<FormErrors>({});
    const [errorMsg,setErrorMsg] = useState<string>("");
    const [success,setSuccess]  = useState<string>("");
    const [validForm,setvalidForm] = useState<valid>({
    name: false,
    category: false,
    description: false,
    availableQty: false,
    minQty: false,
    unitPrice: false,
    supplier: false
    })
    const navigate = useNavigate();
    const params = useParams();
    const {id} = params;
    useEffect(()=>{
        
        if(id)
        axios.get("http://localhost:3001/stocks/"+id)
        .then(res=>{setFormData(res.data); setSuccess("data fetched sucessfully")})
        .catch(res=>setErrorMsg("id not found"))
    },[]);
    const categorylist = ["Electronics", "Stationery", "Mobile", "Watch"]
    const handleChange = (e:ChangeEvent<HTMLInputElement|HTMLSelectElement>) =>{
        const {name,value} = e.target;
        setFormData({...formData,[name]:value})
        validate(name,value);
    }

    const validate = (fieldName : string, fieldValue:string|number)=>{
        let newError:FormErrors = {...error};
        switch(fieldName){
            case "name":{
                if(!fieldValue){
                    newError.name = "name is required"
                    setvalidForm({...validForm,[fieldName]:false})
                }
                else{
                    newError.name = ""
                    setvalidForm({...validForm,[fieldName]:true})
                }
                break;
            }
            case "category":{
                if(!fieldValue){
                    newError.category = "category is required"
                    setvalidForm({...validForm,[fieldName]:false})
                }
                else{
                    newError.category = ""
                    setvalidForm({...validForm,[fieldName]:true})
                }
                break;
            }
            case "availableQty":{
                if(!fieldValue){
                    newError.availableQty = "availableQty is required"
                    setvalidForm({...validForm,[fieldName]:false})
                }
                else{
                    newError.availableQty = ""
                    setvalidForm({...validForm,[fieldName]:true})
                }
                break;
            }
            case "minQty":{
                if(!fieldValue){
                    newError.minQty = "minQty is required"
                    setvalidForm({...validForm,[fieldName]:false})
                }
                else{
                    newError.minQty = ""
                    setvalidForm({...validForm,[fieldName]:true})
                }
                break;
            }
            case "unitPrice":{
                if(!fieldValue){
                    newError.unitPrice = "unitPrice is required"
                    setvalidForm({...validForm,[fieldName]:false})
                }
                else{
                    newError.unitPrice = ""
                    setvalidForm({...validForm,[fieldName]:true})
                }
                break;
            }
            default:
                break;
        }
        setError(newError);
    }
    const handleSubmit = async(e:FormEvent<HTMLFormElement>)=>{
        e.preventDefault();
        await axios.put(`http://localhost:3001/stocks/`+id,formData)
        .then(res=>setFormData(res.data))
        .catch(err=> setErrorMsg("cannot upload"))
    }       
    return(
        <div className="container-fluid" style={{justifyContent:"center"}}>
            <h1>Edit Item</h1>
            <form  onSubmit={handleSubmit}>
                <div className="form-group">
                    <label className="form-label" htmlFor="name">name</label>
                    <input
                    type="text"
                    className="form-control"
                    placeholder="Enter name"
                    name="name"
                    id="name"
                    value={formData.name}
                    onChange={handleChange}
                    />
                    {error.name  && <span className="text-danger">{error.name}</span>}
                </div>
            <div className="form-group">
                <label className="form-label" htmlFor="category">Category</label>
                <select 
                className="form-control"
                name="category"
                value={formData.category}
                onChange={handleChange}
                id="category">
                    {categorylist.map((e,index)=>{
                        return(
                            <option key={index} value={e}>{e}</option>
                        )
                    })}
                </select>
                {error.category && <span className="text-danger">{error.category}</span>}
            </div>
            <div className="form-group">
                <label className="formlabel" htmlFor="description">Description</label>
                <input
                type="textArea"
                name="description"
                className="form-control"
                id="description"
                placeholder="enter description"
                onChange={handleChange}
                value={formData.description} />
            </div>
            <div className="form-group">
                <label className="formlabel" htmlFor="availableQty">availableQty</label>
                <input
                type="number"
                name="availableQty"
                className="form-control"
                id="availableQty"
                placeholder="enter availableQty"
                onChange={handleChange}
                value={formData.availableQty} />
                {error.availableQty && <span className="text-danger">{error.availableQty}</span>}
            </div>
            <div className="form-group">
                <label className="formlabel" htmlFor="minQty">minQty</label>
                <input
                type="number"
                name="minQty"
                className="form-control"
                id="minQty"
                placeholder="enter minQty"
                onChange={handleChange}
                value={formData.minQty} />
                {error.minQty && <span className="text-danger">{error.minQty}</span>}
            </div>
             <div className="form-group">
                <label className="formlabel" htmlFor="unitPrice">unitPrice</label>
                <input
                type="number"
                name="unitPrice"
                className="form-control"
                id="unitPrice"
                placeholder="enter unitPrice"
                onChange={handleChange}
                value={formData.unitPrice} />
                {error.unitPrice && <span className="text-danger">{error.unitPrice}</span>}
            </div>
             <div className="form-group">
                <label className="formlabel" htmlFor="supplier">supplier</label>
                <input
                type="textArea"
                name="supplier"
                className="form-control"
                id="supplier"
                placeholder="enter supplier"
                onChange={handleChange}
                value={formData.supplier} />
            </div>
            <div className="form-group text-center">
                <button className="btn btn-primary" onClick={()=> setTimeout(()=> {navigate("/")},3000)}> Edit</button>
            </div>
                </form>
                </div>
    )







    
}
export default EditStock;