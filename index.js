import React from 'react'
import ReactDOM from 'react-dom'
import { Route, Link, Switch, BrowserRouter } from 'react-router-dom'
import axios from 'axios'

import {createStore} from 'redux'
import {Provider} from 'react-redux'
import {connect} from 'react-redux'

import reducer from './reducer'
import { updateProd, addProd, removeProd, emptyCart } from './action'
let store = createStore(reducer);

const mapStateToProps = (state) => {
	return {reducer: state};
}
const mapDispatchToProps = () => {
	return {
		updateProd,
		addProd,
		removeProd,
		emptyCart
	}
}

class FormInput extends React.Component{
	constructor(props){
		super(props);
	}
	render(){
		return (
			<div>
				<label className="prodLabel">{this.props.prodLabel}</label>
				<input type="text" id={this.props.inpid} className={this.props.customClass}/>
			</div>
		)
	}
}

class MainForm extends React.Component{
	constructor(props){
		super(props);
	}
	render(){
		return (
			<div className="container">
				<>
					<FormInputStore inpid="pname" prodLabel="PRODUCT NAME"></FormInputStore>
					<FormInputStore inpid="uom" prodLabel="UNIT OF MEASUREMENT"></FormInputStore>
					<FormInputStore inpid="price" prodLabel="PRICE"></FormInputStore>
					<label>PRODUCT IMAGE</label>
					<div className="upload-wrap">
						<div className="btn-round">
							<input id="img" type="file" name="imgurl" className="file-btn"/>
						</div>
					</div>
					<label>PRODUCT DESCRIPTION</label>
					<textarea id="pdesc" rows="10"></textarea>
				</>
			</div>
		)
	}
}

class SaveBtn extends React.Component{
	constructor(props){
		super(props);
		this.handleClick = this.handleClick.bind(this);
	}
	handleClick(evt){
		var prodData = new FormData();
		prodData.set("name",document.getElementById("pname").value)
		prodData.set("uom",document.getElementById("uom").value)
		prodData.set("price",document.getElementById("price").value)
		prodData.set("prodDesc", document.getElementById("pdesc").value)
		prodData.append("imgurl", document.getElementById("img").files[0])
		var c = document.getElementById("img").files;
		console.dir(c);
		axios({
			url: '/api/prod/new',
			method: "POST",
			data: prodData
		}).then((res) => {
			console.dir(res);
		})
	}
	render(){
		return (
			<div>
				<button className="btn" onClick={this.handleClick}>Save</button>
			</div>
		)
	}
}

class ResetBtn extends React.Component{
	constructor(props){
		super(props);
	}
	handleClick(evt){
		console.log(evt);
	}
	render(){
		return (
			<div>
				<button className="btn" onClick={this.handleClick}>Reset</button>
			</div>
		)
	}
}

class AddProductForm extends React.Component{
	constructor(props){
		super(props);
	}
	render(){
		return (
			<>
				<form encType="multipart/form-data">
					<MainFormStore></MainFormStore>
				</form>
				<div className="btn-box">
					<SaveBtnStore></SaveBtnStore>
					<ResetBtnStore></ResetBtnStore>
				</div>
			</>
		)
	}
}

class ProductRow extends React.Component{
	constructor(props){
		super(props);
	}
	render(){
		return (
			<tr className="prod-col" title={"Product Id is "+this.props.prodData.id}>
				<td><img alt="Not Found" src={this.props.prodData.imgurl.replace("public","..")} height="50" width="50"/></td>
				<td>{this.props.prodData.name}</td>
				<td className="desc">{this.props.prodData.prodDesc}</td>
				<td>{this.props.prodData.price}</td>
				<td>{this.props.prodData.uom}</td>
				<td>
					<button className="row-btn">Edit</button>
					<button className="row-btn">Delete</button>
				</td>
			</tr>
		)
	}
}

class ShowProduct extends React.Component{
	constructor(props){
		super(props);
		this.state = {responseJson : [], isRendered: false, pnum: 1};
		this.prevpage = this.prevpage.bind(this);
		this.nextpage = this.nextpage.bind(this);
	}
	componentDidMount(){
		var cdm = this;
		axios({
			url: "/api/prod/",
			method: "GET"
		}).then(function(res){
			console.log("cdm");
			cdm.setAllProd(res.data);
		})
	}
	setAllProd(data){
		this.setState({"responseJson":data});
		this.setState({"isRendered":true});
		console.log("sap")
		console.dir(this.state);
	}
	prevpage(){
		this.setState({pnum: this.state.pnum > 1 ? this.state.pnum - 1 : 1 })
	}
	nextpage(){
		this.setState({pnum: this.state.pnum < Math.floor(this.state.responseJson.length/25)+1 ? this.state.pnum + 1 : Math.floor(this.state.responseJson.length/25)+1 });
	}
	render(){
		if(this.state.isRendered){
			let prodList = [];
			prodList.push(<tr className="head-col"><td>Image</td><td>Product Name</td><td className="desc">Description</td><td>Price</td><td>Unit Of Measurement</td>
			<td> 1 - 25 of {this.state.responseJson.length}
			<a onClick={this.prevpage} className="paginate">&lt; </a>
			<a onClick={this.nextpage} className="paginate"> &gt; </a> </td></tr>)
			for (var i= (this.state.pnum-1)*25 ; (i< this.state.responseJson.length && i< this.state.pnum*25); i++){
				prodList.push(<ProductRowStore prodData={this.state.responseJson[i]} />);
				console.dir(this.state.responseJson[i]);
			}
			return (
				<section>
					<header>
						<span>View Products</span>
						<button className="btn-add">
							<Link to="/react/add">Add a Product</Link>
						</button>
					</header>
					<div>
						<table>{prodList}</table>
					</div>
				</section>
			)
		}
		else{
			return (
				<p>Loading...</p>
			)
		}
	}
}

class CrudHeader extends React.Component{
	constructor(props){
		super(props);
	}
	render(){
		return (
			<div className="common-header">
				<Link to="/react/add">
					<div className="nav-link">Add Product</div>
				</Link>
				<Link to="/react/show">
					<div className="nav-link">View Products</div>
				</Link>
			</div>
		)
	}
}

class StoreHeader extends React.Component{
	constructor(props){
		super(props);
	}
	render(){
		return (
			<div className="common-header">
				<Link to="/react/add">
					<div className="nav-link">Add Products</div>
				</Link>
				<Link to="/react/showcase">
					<div className="nav-link">Home</div>
				</Link>
				{this.props.hideCart ? "" : <Link to="/react/cart">
					<div className="nav-link">Cart ({this.props.reducer.cart.length})</div>
				</Link>}
			</div>
		)
	}
}

class ProductCard extends React.Component{
	constructor(props){
		super(props);
		this.handleClick = this.handleClick.bind(this);
	}
	handleClick(){
		this.props.addProd(this.props.prodData, this.props.prodData.price);
	}
	render(){
		return (
			<div className="prod-card">
				<Link to={`/react/detail/${this.props.prodData.id}`}>
					<img height="200" width="200" src={this.props.prodData.imgurl.replace("public","..")} />
					<div>
						<b>{this.props.prodData.name} - {this.props.prodData.uom}</b>
						<p>
							<span className="price">₹ {this.props.prodData.price}</span>
							<span className="discount"> 10% OFF</span>
						</p>
					</div>
				</Link>
				<div className="add-to-cart" onClick={this.handleClick}><button>+ </button> ADD</div>
			</div>
		)
	}
}

class ShowCase extends React.Component{
	constructor(props){
		super(props);
		this.state = {responseJson : [], isRendered: false};
	}
	componentDidMount(){
		var cdm = this;
		axios({
			url: "/api/prod/",
			method: "GET"
		}).then(function(res){
			cdm.setAllProd(res.data);
		})
	}
	setAllProd(data){
		this.setState({"responseJson":data});
		this.setState({"isRendered":true});
	}
	render(){
		if(this.state.isRendered){
			let prodList = [];
			for (var i=0; i< this.state.responseJson.length; i++){
				prodList.push(<ProductCardStore prodData={this.state.responseJson[i]}></ProductCardStore>)
			}
			return (
				<div className="showcase">
					{prodList}
				</div>
			)
		}
		else{
			return (<p>Loading ...</p>)
		}
	}
}

class DetailPage extends React.Component{
	constructor(props){
		super(props);
		this.state = {"isRendered": false};
	}
	componentDidMount(){
		console.log(this.props.match.params.id);
		axios({
			url: "/api/getprod/"+this.props.match.params.id,
			method: "GET"
		}).then((res) => {
			this.setState({"isRendered": true, "data": res.data});
		})
	}
	render(){
		if(this.state.isRendered){
			let prodData = this.state.data[0];
			return (
				<>
					<StoreHeaderStore></StoreHeaderStore>
					<div className="disp-flex">
						<div className="img-wrap">
							<img src={prodData.imgurl.replace("public","/")} height="400" width="600"/>
						</div>
						<div className="text-wrap">
							<h2>{prodData.name} - {prodData.uom}</h2>
							<span className="prod-by">By Regular Vegetables</span>
							<p>Type: Veg</p>
							<div className="disp-flex price-div">
								<div>Price</div>
								<div>₹ {prodData.price} <span className="discount"> 10% OFF</span>
								<p>1 {prodData.uom}</p>
								<span>(Prices are inclusive of all taxes)</span></div>
							</div>
							<div className="add-cart-div">
								<button className="add-cart"><img height="20" width="20" src="/cart.png"/> ADD TO CART</button>
								<p><img height="20" width="20" src="/shield.png"/> Safe and Secure Payments. 100% Authentic Products</p>
							</div>
							<div className="spec">
								<h1>Specification</h1>
								<span>Type</span>
								<span>Veg</span>
							</div>
							<div className="desc-in-det">
								<h1>Description</h1>
								<p>{prodData.prodDesc}</p>
							</div>
						</div>
					</div>
				</>
			)
		}
		else{
			return (<p>Loading ...</p>)
		}
	}
}

class CheckoutPage extends React.Component{
	constructor(props){
		super(props);
		this.state = {"isRendered":false}
	}
	componentDidMount(){
		//
	}
	render(){
		let cartItems = [], rawData = this.props.reducer.cart;
		for(var i = 0; i < rawData.length; i++){
			cartItems.push(<tr>
				<td className="tr1"><img src={rawData[i].imgurl} />
				<div className="cart-item-name">{rawData[i].name}</div> </td>
				<td>
					<select>
						<option value="1">1</option><option value="2">2</option><option value="3">3</option>
					</select>
				</td>
				<td>{rawData[i].price}</td>
				<td>{rawData[i].price}</td>
			 </tr>)
		}
		return (
			<>
				<StoreHeaderStore hideCart={true}></StoreHeaderStore>
				<div className="disp-flex">
					<div className="cart-items">
						<span className="cart-title">Shopping Cart</span>
						<span> ({this.props.reducer.cart.length} items)</span>
						<span className="clear">Clear Cart</span>
						<table>
						<tr>
							<td>Item Details</td>
							<td>Quantity</td>
							<td>Rate</td>
							<td>Amount</td>
						</tr>
						{cartItems}
					</table>
					</div>
					<div className="checkout-status">
						Order Worth: {this.props.reducer.cost}
						<div>Amount Payable: {this.props.reducer.cost}</div>
					</div>
				</div>
			</>
		)
	}
}

class App extends React.Component{
	constructor(props){
		super(props);
	}
	render(){
		return (
			<Provider store={store}>
			<BrowserRouter>
				<Switch>
					<Route path="/react/add">
						<CrudHeader></CrudHeader>
						<AddProductFormStore></AddProductFormStore>
					</Route>
					<Route path="/react/show">
						<CrudHeader></CrudHeader>
						<ShowProductStore></ShowProductStore>
					</Route>
					<Route path="/react/showcase">
						<StoreHeaderStore></StoreHeaderStore>
						<ShowCaseStore></ShowCaseStore>
					</Route>
					<Route path="/react/detail/:id" component={DetailPageStore}/>
					<Route path="/react/cart" component={CheckoutPageStore} />
				</Switch>
			</BrowserRouter></Provider>
		)
	}
}

const FormInputStore = connect(mapStateToProps,mapDispatchToProps())(FormInput);
const MainFormStore = connect(mapStateToProps,mapDispatchToProps())(MainForm);
const SaveBtnStore = connect(mapStateToProps,mapDispatchToProps())(SaveBtn);
const ResetBtnStore = connect(mapStateToProps,mapDispatchToProps())(ResetBtn);
const AddProductFormStore = connect(mapStateToProps,mapDispatchToProps())(AddProductForm);
const ProductRowStore = connect(mapStateToProps,mapDispatchToProps())(ProductRow);
const ShowProductStore = connect(mapStateToProps,mapDispatchToProps())(ShowProduct);
const StoreHeaderStore = connect(mapStateToProps,mapDispatchToProps())(StoreHeader);
const ProductCardStore = connect(mapStateToProps,mapDispatchToProps())(ProductCard);
const ShowCaseStore = connect(mapStateToProps,mapDispatchToProps())(ShowCase);
const DetailPageStore = connect(mapStateToProps,mapDispatchToProps())(DetailPage);
const CheckoutPageStore = connect(mapStateToProps,mapDispatchToProps())(CheckoutPage);

ReactDOM.render(<App/>,document.getElementById("root"));