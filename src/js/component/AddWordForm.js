import React from 'react';
import PropTypes from 'prop-types'
import {
    Form, Input, Button, Modal, message,
} from 'antd';
import ClassificationsSelect from './ClassificationsSelect';

function hasErrors(fieldsError) {
    return Object.keys(fieldsError).some(field => fieldsError[field]);
}

const formItemLayout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 14 },
  };

class VerticalAddWordForm extends React.Component {
    static contextTypes = {
        onSetWord: PropTypes.func,
        onGetWord: PropTypes.func
    }

    componentDidMount() {
        this.props.form.validateFields();
    }

    handleSubmit = (e) => {
        const {setFieldsValue} = this.props.form
        e.preventDefault();
        this.props.form.validateFields(async (err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);
                const data = {
                    word:values.word,
                    translate:values.translate,
                    phonetic:values.phonetic,
                    classifications:this.ClassificationsSelect.getSpecifiedClassifications()
                }
                // console.log(data)
                this.context.onSetWord(data)
                    .then((data)=>{
                        // console.log(data)
                        setFieldsValue({'word':'','translate':'','phonetic':''})
                        message.success('添加成功')
                        this.props.modalInvisible()
                    })
            }
        });
    }

    render() {
        const {
            getFieldDecorator, getFieldsError, getFieldError, isFieldTouched,
        } = this.props.form;

        // Only show error after a field is touched.
        const wordError = isFieldTouched('word') && getFieldError('word');
        const translateError = isFieldTouched('translate') && getFieldError('translate');
        return (
            <Form onSubmit={this.handleSubmit}>
                <Form.Item
                    className='d-flex justify-content-center'
                    label='单词'
                    {...formItemLayout}
                    validateStatus={wordError ? 'error' : ''}
                    help={wordError || ''}
                >
                    {getFieldDecorator('word', {
                        rules: [{ required: true, message: '请输入单词！' }],
                    })(
                        // <Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="Username" />
                        <Input AUTOCOMPLETE="off"/>
                    )}
                </Form.Item>
                <Form.Item
                    className='d-flex justify-content-center'
                    label='发音'
                    {...formItemLayout}
                    validateStatus={wordError ? 'error' : ''}
                    help={wordError || ''}
                >
                    {getFieldDecorator('phonetic', {
                        rules: [{ required: false}],
                    })(
                        <Input AUTOCOMPLETE="off"/>
                    )}
                </Form.Item>
                <Form.Item
                    label='翻译'
                    className='d-flex justify-content-center'
                    {...formItemLayout}
                    validateStatus={translateError ? 'error' : ''}
                    help={translateError || ''}
                >
                    {getFieldDecorator('translate', {
                        rules: [{ required: true, message: '请输入翻译！' }],
                    })(
                        <Input.TextArea autosize={{minRows:1, maxRows:6}} AUTOCOMPLETE="off"/>
                    )}
                </Form.Item>
                <Form.Item
                    label='单词分类'
                    className='d-flex justify-content-center'
                    {...formItemLayout}
                >
                    {getFieldDecorator('classifications', {
                        rules: [{ required: false }],
                    })(
                        // <Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="Password" />
                        <ClassificationsSelect ref={ele=>this.ClassificationsSelect = ele}/>
                    )}
                </Form.Item>
                <Form.Item
                    wrapperCol={{span:14,offset:4}}
                    className='d-flex justify-content-center'
                    >
                    <Button
                        type="primary"
                        htmlType="submit"
                        disabled={hasErrors(getFieldsError())}
                        // className='float-right mr-4'
                    >
                        添加
                    </Button>
                </Form.Item>
            </Form>
        );
    }
}

const WrappedAddWordForm = Form.create({ 
    name: 'vertical_login',
    mapPropsToFields(props){
        if(!props.initialValue)return {}
        return {
            word:Form.createFormField({value:props.initialValue.word}),
            phonetic:Form.createFormField({value:props.initialValue.phonetic}),
            translate:Form.createFormField({value:props.initialValue.translate}),
            classifications:Form.createFormField({value:props.initialValue.classifications}),
        }
    } 
})(VerticalAddWordForm);

export default class WrappedAddWordFormModal extends React.Component{
    state={
        addWordModalVisible:false
    }
    modalInvisible=()=>{
        this.setState({addWordModalVisible:false,initialValue:''})
    }
    modalVisible=()=>{
        this.setState({addWordModalVisible:true})
    }
    addDataAndModalVisible = (data)=>{
        this.setState({initialValue:data,addWordModalVisible:true})
    }
    render() {
        const {addWordModalVisible, initialValue} = this.state
        return (
            <Modal
                width={'25rem'}
                visible={addWordModalVisible}
                title='添加单词'
                footer={null}
                onCancel={this.modalInvisible}
            >
                <WrappedAddWordForm modalInvisible={this.modalInvisible} initialValue ={initialValue}/>
            </Modal>
        )
    }
} 

