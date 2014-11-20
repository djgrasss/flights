import urllib2
import urllib
import json
import subprocess
import time
import os
import traceback

def get_query_data(flights_to_process):
	print "getting "+str(flights_to_process)+" queries"
	response = urllib2.urlopen('http://arankhanna.com/queryjson.php?num='+str(flights_to_process))
	data = json.load(response)
	return data



queries_to_run =3
while True:
	print "starting new loop"
	
	try:
		processes = []
		# Series
		for query in get_query_data(queries_to_run):
			arg1 = query['price_floor']
			arg2 = query['departing_flexible']
			arg3 = query['returning_flexible']
			arg4 = query['owners']
			arg5 = query['departing']
			arg6 = query['returning']
			arg7 = query['leaving_from'] 
			arg8 = query['arriving_at']
			arg9 = query['id']
			arg10 = query['leaving_nearby']
			arg11 = query['arriving_nearby']
			p = subprocess.Popen('C:\\Python27\\python.exe ita.py '+arg1+' '+arg2+' '+arg3+' '+arg4+' '+arg5+' '+arg6+' '+arg7+' '+arg8+' '+arg9+' '+arg10+' '+arg11)
			processes.append(p)

		# TODO add kill process.
		while len(processes) > 0:
			time.sleep(3)
			for proc in processes:
			    status = proc.poll()
			    if status == None:
			        continue
			    elif status == 0:
			        processes.remove(proc)
			        print "process complete"
			    	# os.killpg(proc.pid, signal.SIGTERM)
			    else:
			        print "command failed with status:", status
			    	# os.killpg(proc.pid, signal.SIGTERM)

	except Exception as e:
		print 'an exception occurred with value:'
		traceback.print_exec()

	print "waiting for next loop"
	time.sleep(300)