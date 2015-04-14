
angular.module("d3_data").controller "OrbitalCsvCtrl2", ($scope) ->

	d3.csv "orbital_data.csv", (data) ->

		# since its a csv file we need to format the data a bit
		dateFormat = d3.time.format("%Y-%m-%d")
		numberFormat = d3.format(".2f")
		s = $scope
		s.colorbrewer = colorbrewer
		data.forEach (d) ->
			d.dd = dateFormat.parse(d.date)
			d.month = d3.time.month(d.dd) # pre-calculate month for better performance
			d.car_count = +d.car_count # coerce to number
			d.weather = (+d.weather)+36

		#### Create Crossfilter Dimensions and Groups
		#See the [crossfilter API](https://github.com/square/crossfilter/wiki/API-Reference) for reference.
		ndx = s.ndx = crossfilter(data)
		all = s.all = ndx.groupAll()
		# dimension by year
		s.yearlyDimension = ndx.dimension((d) ->
			d3.time.month(d.month).getMonth()
		)
		# maintain running tallies by year as filters are applied or removed
		# callback for when data is added to the current filter results
		s.yearlyPerformanceGroup = s.yearlyDimension.group().reduce((p, v) ->
			++p.count
			p.absGain += v.car_count
#			p.fluctuation += Math.abs(v.close - v.open)
			p.sumIndex += v.car_count
			p.avgIndex = p.sumIndex / p.count
			p.percentageGain = (p.absGain / p.avgIndex) * 100
#			p.fluctuationPercentage = (p.fluctuation / p.avgIndex) * 100
			p

		# callback for when data is removed from the current filter results
		, (p, v) ->
			--p.count
			p.absGain -= v.car_count
#			p.fluctuation -= Math.abs(v.close - v.open)
			p.sumIndex -= v.car_count
			p.avgIndex = p.sumIndex / p.count
			p.percentageGain = (p.absGain / p.avgIndex) * 100
#			p.fluctuationPercentage = (p.fluctuation / p.avgIndex) * 100
			p

		# initialize p
		, ->
			count: 0
			absGain: 0
#			fluctuation: 0
#			fluctuationPercentage: 0
			sumIndex: 0
			avgIndex: 0
			percentageGain: 0
		)

		# dimension by full date
		s.dateDimension = ndx.dimension((d) ->
			d.dd
		)

		# dimension by month
		s.moveMonths = ndx.dimension((d) ->
			d.month # day instead of Month
		)

		# group by total movement within month
		s.monthlyMoveGroup = s.moveMonths.group().reduceSum((d) ->
			d.car_count
		)

		# group by total volume within move, and scale down result
		s.volumeByMonthGroup = s.moveMonths.group().reduceSum((d) ->
			d.car_count
		)
		s.indexAvgByMonthGroup = s.moveMonths.group().reduce((p, v) ->
			++p.days
			p.total += v.car_count
			p.avg = Math.round(p.total / p.days)
			p
		, (p, v) ->
			--p.days
			p.total -= v.car_count
			p.avg = (if p.days then Math.round(p.total / p.days) else 0)
			p
		, ->
			days: 0
			total: 0
			avg: 0
		)

		# create categorical dimension
		s.gainOrLoss = ndx.dimension((d) ->

			if d.weather <= 34.3
				"<34.3"
			else if d.weather > 34.3 and d.weather <= 35.9
				"34-35.7"
			else if d.weather > 35.9 and d.weather <= 37
				"35.7-37"
			else
				"37<"

		)

		# produce counts records in the dimension
		s.gainOrLossGroup = s.gainOrLoss.group()

		# determine a histogram of percent changes
		s.fluctuation = ndx.dimension((d) ->
			Math.round (110-d.car_count)/d.car_count * 100
		)
		s.fluctuationGroup = s.fluctuation.group()

		# summerize volume by quarter
		s.quarter = ndx.dimension((d) ->
			month = d.dd.getMonth()
			if month <= 2
				"Q1"
			else if month > 3 and month <= 5
				"Q2"
			else if month > 5 and month <= 8
				"Q3"
			else
				"Q4"
		)
		s.quarterGroup = s.quarter.group().reduceSum((d) ->
			d.car_count
		)

		# counts per weekday
		s.dayOfWeek = ndx.dimension((d) ->
			day = d.dd.getDay()
			name = [ "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat" ]
			day + "." + name[day]
		)
		s.dayOfWeekGroup = s.dayOfWeek.group()

		#### Define Chart Attributes
		#Define chart attributes using fluent methods. See the [dc API Reference](https://github.com/dc-js/dc.js/blob/master/web/docs/api-1.7.0.md) for more information
		#
		s.gainOrLossChartLabel = (d) ->

			# if an option is a function, it is called with this beinh the chart
			return d.key + "(0%)"  if @hasFilter() and not @hasFilter(d.key)
			d.key + "(" + Math.floor(d.value / all.value() * 100) + "%)"

		s.bubbleChartOptions =
			colorAccessor: (d) ->
				d.value.absGain

			keyAccessor: (p) ->
				p.value.absGain

			valueAccessor: (p) ->
				p.value.percentageGain

			radiusValueAccessor: (p) ->
				p.value.fluctuationPercentage

			label: (p) ->
				p.key

			title: (p) ->
				[ p.key, "Index Gain: " + numberFormat(p.value.absGain), "Index Gain in Percentage: " + numberFormat(p.value.percentageGain) + "%", "Fluctuation / Index Ratio: " + numberFormat(p.value.fluctuationPercentage) + "%" ].join "\n"

		s.fluctuationChartOptions = filterPrinter: (filters) ->
			filter = filters[0]
			s = ""
			s += numberFormat(filter[0]) + "% -> " + numberFormat(filter[1]) + "%"
			s

		s.fluctuationChartPostSetupChart = (c) ->

			# Customize axis
			c.xAxis().tickFormat (v) ->
				v + "%"

			c.yAxis().ticks 5


		##### Stacked Area Chart
		#Specify an area chart, by using a line chart with `.renderArea(true)`
		s.moveChartOptions =
			valueAccessor: (d) ->
				d.value.avg


			# title can be called by any stack layer.
			title: (d) ->
				value = (if d.value.avg then d.value.avg else d.value)
				value = 0  if isNaN(value)
				dateFormat(d.key) + "\n" + numberFormat(value)

		s.moveChartPostSetupChart = (c) ->

			# stack additional layers with `.stack`. The first paramenter is a new group.
			# The second parameter is the series name. The third is a value accessor.
			c.stack s.monthlyMoveGroup, "Monthly Index Move", (d) ->
				d.value


			# Add the base layer of the stack with group. The second parameter specifies a series name for use in the legend
			c.group s.indexAvgByMonthGroup, "Daily Car Count"

		s.dayOfWeekPostSetupChart = (c) ->
			c.label((d) ->
				d.key.split(".")[1]
			).title((d) ->
				d.value
			).xAxis().ticks 4


		# data table does not use crossfilter group but rather a closure
		# as a grouping function
		s.tableGroup = (d) ->
			format = d3.format("02d")
			d.dd.getFullYear() + "/" + format((d.dd.getMonth() + 1))

		s.tablePostSetupChart = (c) ->
			# dynamic columns creation using an array of closures
			# (optional) sort using the given field, :default = function(d){return d;}
			# (optional) sort order, :default ascending
			# (optional) custom renderlet to post-process chart using D3
			c.columns([ (d) ->
				d.date
			, (d) ->
				d.day_of_week
			, (d) ->
				numberFormat d.weather
			, (d) ->
				numberFormat d.car_count
#			, (d) ->
#				numberFormat d.close - d.open

			 ]).sortBy((d) ->
				d.dd
			).order(d3.ascending).renderlet (table) ->
				table.selectAll(".dc-table-group").classed "info", true


		s.resetAll = ->
			dc.filterAll()
			dc.redrawAll()

		$scope.$apply()
