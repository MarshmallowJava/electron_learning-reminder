import * as React from 'react';
import "./App.scss"
import Container from 'react-bootstrap/Container'
import Button from "react-bootstrap/Button"

export default function App(){
    return (
        <Container fluid>
            <h1>Reminder</h1>
            This manages the risk of deadlines.
            <div className="mt-4">
                <Button
                    onClick={() => {
                        window.subPageAPI.open()
                    }}
                >
                    Open Subwindow
                </Button>
            </div>
        </Container>
    )
}
