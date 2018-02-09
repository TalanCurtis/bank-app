import React, { Component } from 'react';
import './Private.css';
import { connect } from 'react-redux';
import { getUser } from '../../redux/users';

class Private extends Component {

    componentDidMount() {
        this.props.getUser()
    }

    getBalance(){
        return '$' + Math.floor((Math.random() + 1)*1000) + '.00'
    }

    render() {
        // cool trick to see data in render return
        //{JSON.stringify(this.props.userData, null, 2)}
        let {userData} = this.props;
        return (
            <div className='Private'>
                <h3>Account Holder: {userData.user_name ? userData.user_name: null}</h3>
                {
                    userData.img ?
                    <img className="avatar" src={userData.img} alt=''/> :
                     null
                }
                <h3>Account Number: {userData.auth_id ? userData.auth_id : null}</h3>
                <h3>Account Balance: { this.getBalance()}</h3>
                <a href="http://localhost:3005/logout">
                    <button>Logout</button>
                </a>
            </div>

        )
    }
}

const outputActions = {
    getUser: getUser
}

function mapStateToProps(state) {
    return {
        userData: state.user
    }
}

export default connect(mapStateToProps, outputActions)(Private)