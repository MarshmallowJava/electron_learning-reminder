import * as React from 'react'
import "./App.scss"

import Container from 'react-bootstrap/Container'
import Button from "react-bootstrap/Button"
import Tab from "react-bootstrap/Tab"
import Tabs from "react-bootstrap/Tabs"
import Table from "react-bootstrap/Table"
import Pagination from "react-bootstrap/Pagination"
import Spinner from "react-bootstrap/Spinner"

export default function App(){
    //タイトル
    const subtitle = ["提出忘れは防がねばならぬ", "ペーパーレスは実現された！", "* 課題は登録しないと効果がないぞ"]

    const [data, setData] = React.useState([]);
    const [displayData,setDisplayData] = React.useState([]);
    const [loading, setLoading] = React.useState(false);

    const perPage = 5;
    const maxPage = 5;
    const pageCount = Math.ceil(data.length / perPage);
    const items = [];
    const [active, setActive] = React.useState(1);

    //ページネーション処理
    items.push(<Pagination.First onClick={() => {
        setActive(1);
    }}/>);
    items.push(<Pagination.Prev onClick={() => {
        setActive(Math.max(1, active - 1));
    }}/>);

    if(pageCount <= maxPage){
        for(let number = 1;number <= pageCount;number++){
            items.push(
                <Pagination.Item key={number} active={number === active} onClick={() => {
                    setActive(number);
                }}>
                    {number}
                </Pagination.Item>
            );
        }
    }else{
        let from = active - Math.floor((maxPage - 1) / 2);
        let to = Math.max(1, from) + maxPage - 1;
        from = Math.min(to, pageCount) - maxPage + 1;

        if(from > 1){
            items.push(<Pagination.Ellipsis disabled/>);
        }

        for(let number = Math.max(1, from);number <= Math.min(to, pageCount);number++){
            items.push(
                <Pagination.Item key={number} active={number === active} onClick={() => {
                    setActive(number);
                }}>
                    {number}
                </Pagination.Item>
            );
        }

        if(to < pageCount){
            items.push(<Pagination.Ellipsis disabled/>);
        }
    }

    items.push(<Pagination.Next onClick={() => {
        setActive(Math.min(active + 1, pageCount));
    }}/>);
    items.push(<Pagination.Last onClick={() => {
        setActive(pageCount);
    }}/>);

    //課題データのやり取り
    React.useEffect(() => {
        window.updateData.response("data", (json) => {
            setData(json);
            setLoading(false);
        })
    }, []);

    React.useEffect(() => {
        let array = [];
        for(let number = 0;number < perPage;number++){
            let index = (active - 1) * perPage + number;
            if(index < data.length)
                array.push(data[index]);
        }

        setDisplayData(array);
    }, [active, data]);

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
                                loading ? (
                                    <Spinner animation="border" role="status">
                                        <span className="visually-hidden"> データをダウンロード中...</span>
                                    </Spinner>
                                ):(
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
                                                    displayData.map(
                                                        (item) => (
                                                            <tr key={item.id}>
                                                                <td>{item.class}</td>
                                                                <td>{item.assignment}</td>
                                                                <td>{item["term-from"] + "-" + item["term-to"]}</td>
                                                                <td>{item.resolve == 0 ? ("未提出") : ("提出済み")}</td>
                                                            </tr>
                                                        )
                                                    )
                                                }
                                            </tbody>
                                        </Table>
                                    )    
                                )
                            }
                            <div className="pagination">
                                {
                                    data.length == 0 ? (
                                        ""
                                    ) : (
                                        <Pagination>
                                            {items}
                                        </Pagination>    
                                    )
                                }
                            </div>
                            <div className="button">
                                <Button onClick={() => {
                                    window.updateData.request()
                                    setLoading(true);
                                }}>
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
