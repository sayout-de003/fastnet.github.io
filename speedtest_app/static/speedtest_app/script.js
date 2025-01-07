document.addEventListener("DOMContentLoaded", () => {
    const startTestBtn = document.getElementById("startTestBtn");
    const liveCalculation = document.getElementById("liveCalculation");
    const results = document.getElementById("results");
    const liveDownload = document.getElementById("liveDownload");
    const liveUpload = document.getElementById("liveUpload");
    const livePing = document.getElementById("livePing");
    const resultDownload = document.getElementById("resultDownload");
    const resultUpload = document.getElementById("resultUpload");
    const resultPing = document.getElementById("resultPing");

    const websocketUrl = "ws://localhost:8000/ws/speedtest/";

    startTestBtn.addEventListener("click", () => {
        results.classList.add("hidden");
        liveCalculation.classList.remove("hidden");

        const socket = new WebSocket(websocketUrl);

        socket.onmessage = (event) => {
            const data = JSON.parse(event.data);

            if (data.type === "update") {
                if (data.metric === "download_speed") {
                    liveDownload.textContent = data.value.toFixed(2);
                } else if (data.metric === "upload_speed") {
                    liveUpload.textContent = data.value.toFixed(2);
                }
            } else if (data.type === "result") {
                liveCalculation.classList.add("hidden");
                results.classList.remove("hidden");

                resultDownload.textContent = data.download_speed.toFixed(2);
                resultUpload.textContent = data.upload_speed.toFixed(2);
                resultPing.textContent = data.ping.toFixed(2);

                socket.close();
            }
        };

        socket.onerror = (error) => {
            liveCalculation.classList.add("hidden");
            alert("Error performing speed test.");
            console.error(error);
        };
    });
});
