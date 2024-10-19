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
    const [loading, setLoading] = React.useState(null);

    const perPage = 5;
    const maxPage = 5;
    const pageCount = Math.ceil(data.length / perPage);
    const items = [];
    const [active, setActive] = React.useState(1);

    const [input_class, setClass] = React.useState("");
    const [input_assign, setAssign] = React.useState("");
    const [input_from, setFrom] = React.useState("");
    const [input_to, setTo] = React.useState("");

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

    const update = () => {
        window.updateData.request()
        setLoading("データをダウンロード中...");
    };

    //課題データのやり取り
    React.useEffect(() => {
        window.updateData.response("data-update", (json) => {
            setData(json);
            setLoading(null);
        })
    }, []);
    React.useEffect(() => {
        window.updateData.response("data-append", (json) => {
            setLoading(null);
        })
    }, []);
    React.useEffect(() => {
        window.updateData.response("data-resolve", (json) => {
            update();
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

    const inputError = () => {
        if(input_class.length == 0)
            return "授業名が入力されていません"
        if(input_assign.length == 0)
            return "課題名が入力されていません"
        if(input_from.length == 0)
            return "期限開始時が入力されていません"
        if(input_to.length == 0)
            return "期限終了時が入力されていません"
        return null
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
                                loading !== null ? (
                                    <div>
                                        <Spinner animation="border" role="status">
                                            <span className="visually-hidden"> Downloading</span>
                                        </Spinner>
                                        <p>{loading}</p>
                                    </div>
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
                                                <td></td>
                                            </thead>
                                            <tbody>
                                                {
                                                    displayData.map(
                                                        (item) => (
                                                            <tr key={item.id}>
                                                                <td>{item.class}</td>
                                                                <td>{item.assignment}</td>
                                                                <td>
                                                                    <div>
                                                                        <p>
                                                                            {displayTime(item["term-from"]) + "-" + displayTime(item["term-to"])}
                                                                        </p>
                                                                        {
                                                                            durationUntilDeadLine(item["term-to"]) < 4 && item.resolve == 0 ? (
                                                                                <p>
                                                                                    <font color="red">期限まであと{durationUntilDeadLine(item["term-to"])}日</font>
                                                                                </p>
                                                                            ) : ("")
                                                                        }
                                                                    </div>
                                                                </td>
                                                                <td>{item.resolve == 0 ? ("未提出") : ("提出済み")}</td>
                                                                <td>
                                                                    <Button onClick={() => {
                                                                        window.updateData.resolve({id: item.id, status: (item.resolve + 1) % 2});
                                                                        setLoading("提出状況を更新しています...", );
                                                                    }}>
                                                                        変更
                                                                    </Button>
                                                                </td>
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
                                    data.length == 0 || loading !== null ? (
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
                                    update();
                                }} disabled={loading !== null}>
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
                                <input type="text" id="input1" value={input_class} onChange={e => setClass(e.target.value)}/>
                            </div>
                            <div className="form-group">
                                <label htmlFor="input2">課題名</label>
                                <input type="text" id="input2"  value={input_assign} onChange={e => setAssign(e.target.value)}/>
                            </div>
                            <div className="form-group">
                                <label htmlFor="input3">提出期限</label>
                                <div>
                                    <input type="datetime-local" id="input3"  value={input_from} onChange={e => setFrom(e.target.value)}/>
                                    ~
                                    <input type="datetime-local" id="input4"  value={input_to} onChange={e => setTo(e.target.value)}/>
                                </div>
                            </div>
                            <div className="form-group">
                                {
                                    loading !== null ? (
                                        <div>
                                        <Spinner animation="border" role="status">
                                            <span className="visually-hidden"> Uploading</span>
                                        </Spinner>
                                        <p>{loading}</p>
                                    </div>
                                    ):(
                                        <p> <font color="red">{inputError()}</font></p>
                                    )
                                }
                                <Button onClick={() => {
                                    let sendData = {};
                                    sendData["class"] = input_class;
                                    sendData["assignment"] = input_assign;
                                    sendData["term-from"] = new Date(input_from).getTime();
                                    sendData["term-to"] = new Date(input_to).getTime();

                                    window.updateData.append(sendData);
                                    setLoading("データをアップロード中...");
                                }} disabled={loading !== null || inputError() !== null}>
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

function durationUntilDeadLine(date){
    const deadline = new Date(date).getTime();
    const now = new Date().getTime();

    return Math.ceil((deadline - now) / (1000 * 60 * 60 * 24));
}

function displayTime(epoch){
    const date = new Date(epoch);
    const options = {
        timeZone: 'Asia/Tokyo',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false, // 24時間形式
      };
    
      // フォーマットした日付文字列を取得
      return  date.toLocaleString('ja-JP', options);
}
