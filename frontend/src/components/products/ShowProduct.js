import React, { useState, useEffect} from "react";
import axios from "axios";
import { Link } from "react-router-dom";


const ShowProducts = () => {

    const [products, setProducts] = useState([])


    const getProducts = async () => {
        const response = await axios.get('http://localhost:8000/api/products/')
        setProducts(response.data)
    }

    useEffect(() => {
        getProducts();
    }, [])


    return (
        <div className="container1">
            <div className="product-grid">
            {
                products.map((product,index) => (
                    <div key={product.id} className="product-card">
                        <img src={product.image} height="100" width="150"  alt="Iphone" style={{borderRadius: "2px", borderTopLeftRadius: '5px'}} />
                        <p style={{color: '#333', marginLeft: '10px', fontWeight: '600'}}>{product.title}</p>
                        <p style={{color: '#ffa700', marginLeft: '10px', fontWeight: '600'}}>{product.price}</p>
                        <p style={{color: '#27ae60', marginLeft: '10px', fontWeight: '400'}}>{product.description}</p>
                        <p style={{color: '#ff500', marginLeft: '10px', fontWeight: '400'}}>{product.created_at}</p>
                        <p style={{color: '#ff500', marginLeft: '10px', fontWeight: '400'}}>{product.seller}</p>
                        
                        


                        <Link className="btn" to={`/${product.id}/`}> <button style={{backgroundColor: "#000", color: "#fff", border: "none", borderRadius: "5px" }} >Show Details</button> </Link>
                                        
                    </div>
                )
                )
            }

            </div>
        </div>
    )
}

export default ShowProducts;