import * as React from 'react';
import "./App.scss"

import Container from 'react-bootstrap/Container'
import Table from "react-bootstrap/Table"

export default function App(){
    const subtitle = ["提出忘れは防がねばならぬ", "ペーパーレスは実現された！", "* 課題は登録しないと効果がないぞ"]

    return (
        <Container>
            <div className="title">
                <h1>REMINDER</h1>
                {subtitle[Math.floor(Math.random() * subtitle.length)]}
            </div>
            <div className="list">
                <h5>課題一覧</h5>
                <Table bordered>
                    <thead>
                        <td>授業</td>
                        <td>課題</td>
                        <td>提出可能期間</td>
                        <td>提出状況</td>
                    </thead>
                </Table>
            </div>
        </Container>
    )
}
