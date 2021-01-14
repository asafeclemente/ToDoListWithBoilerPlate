import React from 'react'

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Button from '@material-ui/core/Button';
import CloseIcon from '@material-ui/icons/Close';
import CheckIcon from '@material-ui/icons/Check';

import {simpleTableStyle} from "./SimpleTableStyle";
import {Typography} from "@material-ui/core";

interface ISimpleTable {
    schema:object;
    data:object[];
    onClick:(event: React.SyntheticEvent,id:string,doc:object)=>void;
    actions:object[];
}

export default function SimpleTable({schema,data,onClick,actions}:ISimpleTable) {

    const hasOnClick = !!onClick;
    const handleRowClick = (id:string,doc:object) => (event:React.SyntheticEvent) =>{
        if(onClick) {
            onClick(event,id,doc);
        }
    }
    const getType = (field:object) => {
        if(field.isImage||field.isAvatar) {
            return 'image'
        } else if(field.type===Number) {
            return 'number'
        } else if(field.type===Date) {
            return 'date'
        } else if(field.type===Boolean) {
            return 'boolean'
        }else if(Array.isArray(field.type) ) {
            return 'list'
        } else if(field.type===String) {
            return 'text'
        } else if(field.isHTML) {
            return 'html'
        } else {
            return 'undefined';
        }
    }

    const renderType = (type:string,data:any) => {
        if(type==='image') {
            return <img src={data} size='tiny' style={simpleTableStyle.containerRenderType} />
        } else if(type==='text'||type==='number') {
            return data;
        }else if(type==='date'&&data.toLocaleDateString()) {
            return data.toLocaleDateString();
        }else if(type==='list') {
            return <Typography style={{wordBreak:'break-word'}}>{
                data.map((item, index, array) => {
                    if (typeof (item) === 'string') {
                        return index===array.length-1 ? item + '.': item + ', '
                    }
                })
            }</Typography>
        }else if(type==='boolean') {
            return data?<CheckIcon/>:<CloseIcon/>;
        }else if(type==='html') {
            return Array.isArray(data)?data.map(d=><div dangerouslySetInnerHTML={{__html: d}} />):<div dangerouslySetInnerHTML={{__html: data}} />;
        } else {
            return null;
        }
    }

    const cols = Object.keys(schema).map(field=>({field,label:schema[field].label,type:getType(schema[field])}));

    return (<Table style={simpleTableStyle.tableBox}>
                <TableHead>
                    <TableRow>
                        {cols.map(col=>{
                            return <TableCell style={simpleTableStyle.tableCell} key={col.name+col.label}>{col.label}</TableCell>
                        })}
                        {actions?(
                            <TableCell  style={simpleTableStyle.tableCell}>{'Ações'}</TableCell>
                        ):null}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {data.map((row,index) => (
                        <TableRow onClick={handleRowClick(row._id, row)} style={{...(row.rowStyle?row.rowStyle:{}),cursor:hasOnClick?'pointer':undefined} } key={row._id||row.key||row.name||'row'+index}>
                            {cols.map((col,index)=>{
                                return <TableCell key={col.name+col.label} style={{...simpleTableStyle.tableCell,width:col.type==='image'?80:undefined}}>
                                    {renderType(col.type,row[col.field])}
                                </TableCell>
                            })}
                            {actions?(
                                <TableCell style={simpleTableStyle.tableCell}>
                                    {actions.map(act=>(
                                        <Button key={act.icon+act.text} onClick={(evt)=>{
                                            evt.preventDefault();
                                            evt.stopPropagation();
                                            act.onClick(row)}
                                        } {...(act.buttonProps||{})}>
                                            {!!act.icon?(act.icon):null}
                                            {!!act.text?(act.text):null}
                                        </Button>
                                    ))}
                                </TableCell>
                            ):null}
                        </TableRow>
                    ))}

                </TableBody>
            </Table>);
}
