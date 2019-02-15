import React from 'react';
import { Select, Icon } from 'antd';
import PropTypes from 'prop-types'
import eventProxy from '../../utils/event-proxy';
import ShowClassificationsModal from './ShowClassificationsModal';
export default class ClassificationsSelect extends React.Component{
    static contextTypes = {
        ongetClassifications: PropTypes.func
    }
    state={
        specifiedClassifications:[],
        classifications:this.context.ongetClassifications()
    }
    componentDidMount(){
        eventProxy.on('classifications',(classifications)=>this.setState({classifications}))
    }

    getValue=()=>{
        return this.state.classifications.join(',');
    }

    render() {
        const {specifiedClassifications, classifications} = this.state
        // console.log(classifications)
        return (
            <div>
                <Select
                    mode='multiple'
                    onChange={(values)=>this.setState({specifiedClassifications:values.filter(classification=>classification!=='新分类')})}
                    value={specifiedClassifications}
                >
                    {classifications.map(classification => 
                        <Select.Option key={classification}>
                            {classification}
                        </Select.Option>
                    )}
                    <Select.Option value='新分类' onClick={()=>{this.ShowClassificationsModal.setModalVisable(true)}} className='border-top text-center'>新分类<Icon type="edit"  className='ml-1'/></Select.Option>
                </Select>
                <ShowClassificationsModal classifications={classifications} ref={(ele)=>this.ShowClassificationsModal=ele} setClassificationOk={()=>eventProxy.trigger('setClassification')}/>
            </div>
        )
    }
}