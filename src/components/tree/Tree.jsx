import {useState} from 'react'
import { v4 as uuidv4 } from 'uuid'
import "./Tree.css"
import 'react-bootstrap'
function Tree(props){

    const initialState = {
        nodes: props.nodes != null? props.nodes: [
            {
                key: uuidv4(),
                text: "First",
                children: [
                    {
                        key: uuidv4(),
                        text: "Second",
                        children: []
                    }
                ]
            },
            { 
                key: uuidv4(),
                text: "Third",
                children: []
            }
        ]
    }
    const [nodes, setNodes] = useState(initialState.nodes)
    const [selectedNodeKey, setSelectedNodeKey] = useState(null)
    const [isEditingNode, setIsEditingNode] = useState(null)


    const removeNode = () => {
        if (!selectedNodeKey) return
        const removeNodeRecursive = (nodesArray, key) => {
            return nodesArray.filter(node => {
                if (node.key === key){
                    return false
                }
                if (node.children && node.children.length > 0){
                    node.children = removeNodeRecursive(node.children, key)
                }
                return true
            })
        }
        setNodes(removeNodeRecursive(nodes, selectedNodeKey))
        setSelectedNodeKey(null)
        setIsEditingNode(false)
    }

    const addNode = () => {
        if (!selectedNodeKey){
            setNodes([...nodes, {key: uuidv4(), text: "New Node", children: []}])
        }else{
            const addNodeRecursive = (nodesArray, key) => {
                return nodesArray.map(node => {
                    if (node.key === key){
                        return{
                            ...node,
                            children:[
                                ...node.children,
                                {key: uuidv4(), text: "New Node", children: []}
                            ]
                        }
                    }
                    if (node.children && node.children.length > 0){
                        node.children = addNodeRecursive(node.children, key)
                    }
                    return node
                })
            }
            setNodes(addNodeRecursive(nodes, selectedNodeKey))
        }
    }

    const resetTree = () => {
        setNodes(initialState.nodes)
        setIsEditingNode(null)
        setSelectedNodeKey(false)
    }
    
    const inputBlure = () => {
        setIsEditingNode(null)
    }

    const handleNodeClick = (key) => {
        if (selectedNodeKey){
            if (isEditingNode) return
            setSelectedNodeKey(null)
        }
        setSelectedNodeKey(key)
        setIsEditingNode(null)
    }

    const  editNode = () => {
        if (!selectedNodeKey) return
        setIsEditingNode(selectedNodeKey)
    }

    const handleKeyDown = (event) =>{
        if (event.key === "Enter"){
            setIsEditingNode(false)
        }
    }

    const changeText = (newText) =>{
        if (!selectedNodeKey) return

        const editNodeRecursive = (nodesArray, key) => {
            return nodesArray.map(node => {
                if (node.key === key){
                    return {...node, text: newText}
                }
                if (node.children && node.children.length > 0){
                    node.children = editNodeRecursive(node.children, key)
                }
                return node
            })
        }
        setNodes(editNodeRecursive(nodes, selectedNodeKey))
    }

    const handleInputChange = (event) => {
        changeText(event.target.value)
    }

    const renderTree = (nodes) => {
        return nodes.map( node => (
            <div key={node.key}>
                <div
                    className={`nodeWrapper`}
                    onClick={() => handleNodeClick(node.key)}
                >
                    {isEditingNode === node.key? (
                        <input
                            type="text"
                            value={node.text}
                            onChange={handleInputChange}
                            onBlur={inputBlure}
                            onKeyDown={handleKeyDown}
                        />
                    ) : (<span className={`text ${selectedNodeKey === node.key ? "selected" : ''} d-block p-2`}>{node.text}</span>)}
                </div>
                <div className="child">
                    {node.children && renderTree(node.children)}
                </div>
            </div>
        ))
    }


    return (
        <div className='container-sm d-block custom-container position-relative'>
            <div className='title d-flex w-100 justify-content-center w-100 p-3'>
                <span>Tree</span>
            </div>
            <div className='tree p-3'>
                {renderTree(nodes)}
            </div>
            <div className='btns position-absolute d-flex flex-row gap-4 justify-content-center bottom-0 w-100 p-3'>
                <button className='btn btn-light' onClick={addNode}>Add</button>
                <button className='btn btn-light' onClick={removeNode}>Remove</button>
                <button className='btn btn-light' onClick={editNode}>Edit</button>
                <button className='btn btn-light' onClick={resetTree}>Reset</button>
            </div>
        </div>
    )
}

export default Tree;