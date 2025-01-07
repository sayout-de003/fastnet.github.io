from django.http import JsonResponse
from django.shortcuts import render
from speedtest import Speedtest

def index(request):
    return render(request, 'speedtest_app/index.html')

def test_speed(request):
    if request.method == "POST":
        st = Speedtest()

        # Get the best server
        st.get_best_server()

        # Initialize the values for download speed, upload speed, and ping
        download_speed = None
        upload_speed = None
        ping = None

        # Start the speed test and periodically send updates back
        while download_speed is None or upload_speed is None or ping is None:
            if download_speed is None:
                download_speed = round(st.download() / 1_000_000, 2)  # Mbps
                print(download_speed )
            if upload_speed is None:
                upload_speed = round(st.upload() / 1_000_000, 2)  # Mbps
            if ping is None:
                ping = round(st.results.ping, 2)  # ms

            # Send the current state as JSON every 0.5 seconds
            context = {
                'download_speed': download_speed,
                'upload_speed': upload_speed,
                'ping': ping,
            }


            # Simulate a small delay to update periodically
            import time
            time.sleep(0.5)

            # Send incremental updates
            if download_speed is None or upload_speed is None or ping is None:
                continue

            return JsonResponse(context)
        
        # After the speed test is completed, return final results
        return JsonResponse({
            'download_speed': download_speed,
            'upload_speed': upload_speed,
            'ping': ping,
        })
    
    return render(request, 'speedtest_app/index.html')
