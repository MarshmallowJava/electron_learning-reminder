import * as React from 'react';
import "./App.scss"

import Container from 'react-bootstrap/Container'
import Button from "react-bootstrap/Button"
import Tab from "react-bootstrap/Tab"
import Tabs from "react-bootstrap/Tabs"
import Table from "react-bootstrap/Table"

export default function App(){
    const subtitle = ["提出忘れは防がねばならぬ", "ペーパーレスは実現された！", "* 課題は登録しないと効果がないぞ"]
    const [data, setData] = React.useState([]);

    const update = async () => {
        const https = require('https');
        https.get("https://script.google.com/macros/s/AKfycbx5VCqBVgEO9pOsMHq5RS9iSRyT7qS2TtHYxKiFDqGn1XiLVQgRWdQDzDVk904I7Zte0g/exec", (response) => {
           let data = '';
           
           response.on('data', (chunk) => {
            data += chunk;
           });

           response.on('end', () => {
            console.log(JSON.parse(data));
           });
        });
    }

    React.useEffect(() => {
        // update();
    }, [data]);
    const on_pressed = () => {
        update();
    }
    return (
        <Container>
            <div className="title">
                <h1>REMINDER</h1>
                {subtitle[Math.floor(Math.random() * subtitle.length)]}
            </div>
            <div className="body">
                <Tabs defaultActiveKey="List" id="uncontrolled-tab-example" className="mb-3">
                    <Tab eventKey="List" title="課題一覧">
                        <div className="list">
                            <h5>課題一覧</h5>
                            {
                                data.length == 0 ? (
                                    <p>データはありません</p>
                                ) : (
                                    <Table striped bordered hover>
                                        <thead>
                                            <td>授業</td>
                                            <td>課題</td>
                                            <td>提出可能期間</td>
                                            <td>提出状況</td>
                                        </thead>
                                        <tbody>
                                            {
                                                data.map(
                                                    (item) => (
                                                        <tr key={item.id}>
                                                            <td>{item.class}</td>
                                                            <td>{item.assignment}</td>
                                                            <td>{item.term-from}</td>
                                                            <td>{item.resolve}</td>
                                                        </tr>
                                                    )
                                                )
                                            }
                                        </tbody>
                                    </Table>
                                )
                            }
                            <div className="button">
                                <Button onClick={on_pressed}>
                                    更新
                                </Button>
                            </div>
                        </div>
                    </Tab>
                    <Tab eventKey="Add" title="課題追加">
                        <div className="add">
                            <h5>課題追加</h5>
                            <div className="form-group">
                                <label htmlFor="input1">授業名</label>
                                <input type="text" id="input1" />
                            </div>
                            <div className="form-group">
                                <label htmlFor="input2">課題名</label>
                                <input type="text" id="input2" />
                            </div>
                            <div className="form-group">
                                <label htmlFor="input3">提出期限</label>
                                <div>
                                    <input type="date" id="input3" />
                                    ~
                                    <input type="date" id="input3" />
                                </div>
                            </div>
                            <div className="button">
                                <Button>
                                    追加
                                </Button>
                            </div>
                        </div>
                    </Tab>
                </Tabs>
            </div>
        </Container>
    )
}
