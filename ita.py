from selenium import webdriver
import time
import sys
from selenium.webdriver.common.keys import Keys
import urllib2
import urllib
import json
import datetime
import traceback
import threading
import sys
import time

def send_mail(leaving_from, arriving_at, lowest_cost, departing, returning, query, owners):
	all_recipient_objects = []
	recipients = owners.split(",")
	for entry in recipients:
		recipient_object = { "email": entry }
		all_recipient_objects.append(recipient_object)

	data = {
		"key": "FCppeY-FJBY6_Mvtq_rMKQ",
		"message": 
		{   "html": "The flight from "+leaving_from+" to "+arriving_at+" is currently at $"+str(lowest_cost)+", leaving on "
			+departing+" and returning on "+returning+" <a href='"+query+"'>BUY IT NOW</a>",
			"text": "The flight from "+leaving_from+" to "+arriving_at+" is currently at $"+str(lowest_cost)+", leaving on "
			+departing+" and returning on "+returning+" get it at: "+query,
			"subject": "$"+str(lowest_cost)+" to "+arriving_at,
			"from_email": "8guys1block@gmail.com",
			"from_name": "FlightGuru",
			"to": all_recipient_objects
		},
		"async": "false"
	}

	encoded_data = json.dumps(data)
	urllib2.urlopen('https://mandrillapp.com/api/1.0/messages/send.json', encoded_data)

	print 'mail sent'



def update_flight(flight_id, price):
	data = {
		"id":flight_id,
		"price":price
	}

	encoded_data = urllib.urlencode(data)

	urllib2.urlopen('http://arankhanna.com/updateflight.php', encoded_data)

	print "price updated to "+str(price)+" for "+str(flight_id)



def delete_flight(flight_id):
	data = {"id": flight_id}

	encoded_data = urllib.urlencode(data)

	urllib2.urlopen('http://arankhanna.com/deleteflight.php', encoded_data)

	print "flight "+str(flight_id)+" deleted"

# TODO possibly broken
# returns navigation data for select
def get_flex_data(flex_string):
	if flex_string == '0':
		return (1,'o')
	elif flex_string == '+-2':
		return (2,'p')
	elif flex_string == '+-1':
		return (1,'p')
	elif flex_string == '-1':
		return (2,'o')
	elif flex_string == '+1':
		return (3,'o')
	else:
		print "invalid flexible date range running max range"
		return (2,'p')

# returns navigation data for select (statically set to 150 mile radius)
# set the 2 to a 1 for 100 mile radius
def get_nearby_data(nearby):
	if nearby == '1':
		return(True, 2, '1')
	else:
		return(False, 0, '')

def run_query(query, *args):

	# Drivers
	driver = webdriver.PhantomJS('C:\\Users\\aran\\Desktop\\phantomjs.exe')
	# driver =webdriver.Chrome('C:\Users\Public\Documents\Code\chromedriver.exe')

	# Constants
	poll_wait_time = 2
	timeout_time = 80
	flights_to_process = 2

	# Program
	departing_date_object = datetime.datetime.strptime(query['departing'], '%Y-%m-%d')
	returning_date_object = datetime.datetime.strptime(query['returning'], '%Y-%m-%d')
	depart_from = query['leaving_from'] 
	arrive_at = query['arriving_at']
	flight_id = query['id']
	if ((depart_from != arrive_at) and (departing_date_object>datetime.datetime.now()) and (departing_date_object<returning_date_object)):
		try:
			departing = departing_date_object.strftime('%m/%d/%Y')
			depart_flex_num, depart_flex_char = get_flex_data(query['departing_flexible'])
			depart_nearby, depart_nearby_num, depart_nearby_char = get_nearby_data(query['leaving_nearby'])
			arrive_nearby, arrive_nearby_num, arrive_nearby_char = get_nearby_data(query['arriving_nearby'])
			
			returning = returning_date_object.strftime('%m/%d/%Y')
			return_felx_num, return_felx_char = get_flex_data(query['returning_flexible'])

			print "querying for flights from "+depart_from+" to "+arrive_at+" leaving "+departing+" and returning "+returning

			driver.get("http://matrix.itasoftware.com/")

			print "filling return date"
			element = driver.find_element_by_id("advanced_rtReturn")
			element.send_keys(returning)
			time.sleep(1)

			print "filling depart flexible"
			element = driver.find_element_by_id("ita_form_Select_11")
			element.send_keys(Keys.ARROW_DOWN)
			for i in range(depart_flex_num):
				element.send_keys(depart_flex_char)
			time.sleep(1)

			print "filling depart date"
			element = driver.find_element_by_id("advanced_rtDeparture")
			element.send_keys(departing)
			time.sleep(1)

			print "filling return flexible"
			element = driver.find_element_by_id("ita_form_Select_13")
			element.send_keys(Keys.ARROW_DOWN)
			for i in range(return_felx_num):
				element.send_keys(return_felx_char)
			time.sleep(1)

			print "filling depart location"
			if (depart_nearby): 
				element = driver.find_element_by_id("ita_form_dialogs_NearbyAirportsToggle_0")
				element.click()
				element = driver.find_element_by_id("ita_form_location_CityOrParkSuggester_0")
				element.send_keys(depart_from+"\n")
				element = driver.find_element_by_id("ita_form_distance_RadiusSelect_0")
				element.send_keys(Keys.ARROW_DOWN)
				for i in range(depart_nearby_num):
					element.send_keys(depart_nearby_char)
				time.sleep(1)
				driver.find_element_by_id("ita_form_dialogs_NearbyAirports_0_selectAll").click()
				time.sleep(1)
				driver.find_element_by_id("ita_form_button_PrimaryButton_0_label").click()
				time.sleep(1)
			else:
				element = driver.find_element_by_id("advancedfrom1")
				element.send_keys(depart_from)
				time.sleep(1)

			print "filling arrive location"
			if (arrive_nearby):
				element_num = '0'
				if (depart_nearby):
					element_num = '1'

				element = driver.find_element_by_id("ita_form_dialogs_NearbyAirportsToggle_1")
				element.click()
				element = driver.find_element_by_id("ita_form_location_CityOrParkSuggester_"+element_num)
				element.send_keys(arrive_at+"\n")
				element = driver.find_element_by_id("ita_form_distance_RadiusSelect_"+element_num)
				element.send_keys(Keys.ARROW_DOWN)
				for i in range(arrive_nearby_num):
					element.send_keys(arrive_nearby_char)
				time.sleep(1)
				driver.find_element_by_id("ita_form_dialogs_NearbyAirports_"+element_num+"_selectAll").click()
				time.sleep(1)
				driver.find_element_by_id("ita_form_button_PrimaryButton_"+element_num+"_label").click()
				time.sleep(1)
				element = driver.find_element_by_id("advancedto1")
				print "querying"
				element.send_keys("\n")
			else:
				element = driver.find_element_by_id("advancedto1")
				element.clear()
				print "querying"
				element.send_keys(arrive_at+"\n")


			timedout = False
			seconds_waited = 0 
			print "waiting on response"
			while (True):
				try:
					best_price_span = driver.find_element_by_id('ita_form_button_LinkButton_0_label')
					print "data loaded"
					break
				except:
					time.sleep(poll_wait_time)
					seconds_waited += poll_wait_time
					if (seconds_waited >= timeout_time):
						driver.save_screenshot(depart_from+"-"+arrive_at+"-"+
							departing+depart_flex_char+str(depart_flex_num)+"-"+returning+return_felx_char+str(return_felx_num)+".png")
						print "timedout"
						timedout = True
						break

			best_price = sys.maxint
			if not timedout:
				children = best_price_span.find_elements_by_xpath('./*')
				for child in children:
					raw_price=child.text[:60]
					best_price = int(raw_price[1:].replace(",",""))
			
			if (best_price <= int(query['price_floor'])):
				# TODO navigate DOM, Screenshot itinerary, upload to public URL (imgur?) and send link
				url = '#'
				send_mail(depart_from, arrive_at, best_price, departing+query['departing_flexible'], returning+query['returning_flexible'], url, query['owners'])

			update_flight(flight_id, best_price)

		except Exception as e:
			print "Scraping failed with exception"
			traceback.print_exc()
			driver.close()
			return
			# driver.save_screenshot(depart_from+"-"+arrive_at+"-"+
			# 				departing+depart_flex_char+str(depart_flex_num)+"-"+returning+return_felx_char+str(return_felx_num)+".png")
			
	else:
		print "invalid flight deleting query from server"
		delete_flight(flight_id)	

	driver.close()


# TODO parse command line
query = {}
query['price_floor'] = sys.argv[1]
query['departing_flexible'] = sys.argv[2]
query['returning_flexible'] = sys.argv[3]
query['owners'] = sys.argv[4]
query['departing'] = sys.argv[5]
query['returning'] = sys.argv[6]
query['leaving_from'] = sys.argv[7]
query['arriving_at'] = sys.argv[8]
query['id'] = sys.argv[9]
query['leaving_nearby'] = sys.argv[10]
query['arriving_nearby'] = sys.argv[11]
try:
	run_query(query)
except Exception as e:
	traceback.print_exc()
