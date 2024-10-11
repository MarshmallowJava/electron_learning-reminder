import * as React from 'react';
import "./App.scss"

import Container from 'react-bootstrap/Container'
import Button from "react-bootstrap/Button"
import Table from "react-bootstrap/Table"

export default function App(){
    const subtitle = ["提出忘れは防がねばならぬ", "ペーパーレスは実現された！", "* 課題は登録しないと効果がないぞ"]
    const [data, setData] = React.useState([]);

    // React.useEffect(() => {
    //     fetch('URL')
    //     .then((response) => response.json())
    //     .then((data) => setData(data))
    //     .then((error) >= console.error("Error: fetching data", error))
    // }, []);
    setData([
        {id: 0, class: "test", assignment: "test2", term: "01/01 ~ 01/02"},
        {id: 1, class: "test", assignment: "test2", term: "01/01 ~ 01/02"},
    ]);

    return (
        <Container>
            <div className="title">
                <h1>REMINDER</h1>
                {subtitle[Math.floor(Math.random() * subtitle.length)]}
            </div>
            <div className="list">
                <h5>課題一覧</h5>
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
                                        <td>{item.term}</td>
                                    </tr>
                                )
                            )
                        }
                    </tbody>
                </Table>
            </div>
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
            </div>
        </Container>
    )
}
