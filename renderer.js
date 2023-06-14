const func = async () => {
    const response = await window.communication.ping();
    console.log(response);
}

func();