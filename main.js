// Global function called when select element is changed
function onCategoryChanged() {
    var select = d3.select('#categorySelect').node();
    // Get current value of select element
    category = select.options[select.selectedIndex].value;
    updateChart1(category);
}

function onCategoryChanged2() {
    var select2 = d3.select('#categorySelect2').node();
    // Get current value of select element
    category2 = select2.options[select2.selectedIndex].value;
    updateChart2(category2);
}

function onCategoryChanged3() {
    var select3 = d3.select('#categorySelect3').node();
    // Get current value of select element
    category3 = select3.options[select3.selectedIndex].value;
    updateChart3(category3);
}

var svg = d3.select('svg');

// Get layout parameters
var svgWidth = +svg.attr('width');
var svgHeight = +svg.attr('height');

var padding = {t: 40, b: 40, l: 60, r: 660};
var cellPadding = 10;

var dataAttributes = ['duration', 'aspect_ratio', 'imdb_score', 'budget', 'gross',
'num_user_for_reviews', 'facenumber_in_poster', 'num_voted_users'];
var dataAttributes2 = ['2010', '2011', '2012', '2013', '2014', '2015', '2016']

// Compute chart dimensions
var cellWidth = svgWidth - padding.l - padding.r;
var cellHeight = (svgHeight - padding.t - padding.b);

var toolTip = d3.tip()
    .attr("class", "d3-tip")
    .offset([-12, 0])
    .html(function(d) {
        return "<h5>"+d['movie_title']+ "(" + d['content_rating']+ ")" +"</h5>";
    });

// Create a group element for appending chart elements
var chartG = svg.append('g')
    .attr('transform', 'translate('+[padding.l, padding.t]+')');

xScale = d3.scaleLinear().range([0, cellWidth - cellPadding]);
xScale.domain([60,240]);
yScale = d3.scaleLinear().range([cellHeight - cellPadding, 0]);
yScale.domain([0,10]);

xAxis = d3.axisBottom(xScale).ticks(9).tickSize(-cellHeight, 0, 0);
yAxis = d3.axisLeft(yScale).ticks(10).tickSize(-cellWidth, 0, 0);

var colorScale = d3.scaleOrdinal(d3.schemeCategory10);

barChartHeight = 300;
barChartWidth = 500;
barBand = barChartHeight / 6;
barHeight = barBand * 0.7;
barChartDisplayed = false;
prev = null;

d3.csv('movies.csv', dataPreprocessor).then(function(dataset) {
    movies = dataset;
    category = 'duration'
    category2 = 'imdb_score'
    category3 = 'All'

    gxAxis = chartG.append('g');
    gxAxis.attr('class', 'x axis')
    .attr('transform', function(d) {
        return 'translate('+[0, cellHeight]+')';
    })
    .call(xAxis);

    gyAxis = chartG.append('g');
    gyAxis.attr('class', 'y axis')
    .call(yAxis)

    svg.call(toolTip);

    gxAxisCircle = chartG.append('g').selectAll('circle').data(movies).enter().append('circle');
    gxAxisCircle.attr("cx", function(d) {
        if (category3 == 'All' || category3 == d.title_year) {
            return xScale(d[category]);
        }
    })
    .attr("cy", function(d) {
        if (category3 == 'All' || category3 == d.title_year) {
            return yScale(d[category2])
        }
    })
    .attr("r", 3)
    .style("fill", function(d) {
        return colorScale(d.title_year); })
    .on('mouseover', toolTip.show)
    .on('mouseout', toolTip.hide)
    .on('click', function(d) {
        return showChart(d);
    });
    


    chartG.append('text')
    .attr('class', 'title')
    .text("Movie Year")
    .attr('transform', 'translate('+[cellWidth + 50, 0]+')');

    dataAttributes2.forEach(function(d) {
    chartG.append('rect')
    .attr('width', 20)
    .attr('height', 20)
    .attr('fill', function() {
        return colorScale(d);
    })
    .attr('x', cellWidth + 50)
    .attr('y', function() {
        return 10 + 25 * (d - 2010);
    })

    chartG.append('text')
    .attr('class', 'legend')
    .text(d)
    .attr('transform', function() {
        return 'translate(' + [cellWidth + 75, 25 + 25 * (d - 2010)] +')';
    });

    });
    });

function updateChart1(selected) {
    if (selected == 'duration') {
        xScale.domain([60,240]);
        xAxis = d3.axisBottom(xScale).ticks(9).tickSize(-cellHeight, 0, 0);
    } else if (selected == 'aspect_ratio') {
        xScale.domain([1.33,16]);
        xAxis = d3.axisBottom(xScale).ticks(8).tickSize(-cellHeight, 0, 0);
    } else if (selected == 'imdb_score') {
        xScale.domain([0,10]);
        xAxis = d3.axisBottom(xScale).ticks(10).tickSize(-cellHeight, 0, 0);
    } else if (selected == 'budget') {
        xScale.domain([0,300000000]);
        xAxis = d3.axisBottom(xScale).ticks(8).tickSize(-cellHeight, 0, 0);
    } else if (selected == 'gross') {
        xScale.domain([0,700000000]);
        xAxis = d3.axisBottom(xScale).ticks(8).tickSize(-cellHeight, 0, 0);
    } else if (selected == 'num_user_for_reviews') {
        xScale.domain([0,3018]);
        xAxis = d3.axisBottom(xScale).ticks(7).tickSize(-cellHeight, 0, 0);
    } else if (selected == 'facenumber_in_poster') {
        xScale.domain([0,31]);
        xAxis = d3.axisBottom(xScale).ticks(7).tickSize(-cellHeight, 0, 0);
    } else if (selected == 'num_voted_users') {
        xScale.domain([0,1500000]);
        xAxis = d3.axisBottom(xScale).ticks(7).tickSize(-cellHeight, 0, 0);
    }
    chartG.selectAll("g.x.axis").call(xAxis);
    gxAxisCircle.attr("cx", function(d) {
        if (category3 == 'All' || category3 == d.title_year) {
            return xScale(d[selected]);
        }
    })
}

function updateChart2(selected) {
    if (selected == 'duration') {
        yScale.domain([60,240]);
        yAxis = d3.axisLeft(yScale).ticks(9).tickSize(-cellWidth, 0, 0);
    } else if (selected == 'aspect_ratio') {
        yScale.domain([1.33,16]);
        yAxis = d3.axisLeft(yScale).ticks(8).tickSize(-cellWidth, 0, 0);
    } else if (selected == 'imdb_score') {
        yScale.domain([0,10]);
        yAxis = d3.axisLeft(yScale).ticks(10).tickSize(-cellWidth, 0, 0);
    } else if (selected == 'budget') {
        yScale.domain([0,300000000]);
        yAxis = d3.axisLeft(yScale).ticks(8).tickSize(-cellWidth, 0, 0);
    } else if (selected == 'gross') {
        yScale.domain([0,700000000]);
        yAxis = d3.axisLeft(yScale).ticks(8).tickSize(-cellWidth, 0, 0);
    } else if (selected == 'num_user_for_reviews') {
        yScale.domain([0,3018]);
        yAxis = d3.axisLeft(yScale).ticks(7).tickSize(-cellWidth, 0, 0);
    } else if (selected == 'facenumber_in_poster') {
        yScale.domain([0,31]);
        yAxis = d3.axisLeft(yScale).ticks(7).tickSize(-cellWidth, 0, 0);
    } else if (selected == 'num_voted_users') {
        yScale.domain([0,1500000]);
        yAxis = d3.axisLeft(yScale).ticks(7).tickSize(-cellWidth, 0, 0);
    }
    chartG.selectAll("g.y.axis").call(yAxis);
    gxAxisCircle.attr("cy", function(d) {
        if (category3 == 'All' || category3 == d.title_year) {
            return yScale(d[selected]);
        }
    })
}

function updateChart3(selected) {
    gxAxisCircle.attr("visibility", function(d) {
        if (selected == 'All' || selected == d.title_year) {
            return "visible";
        } else {
            return "hidden";
        }
    })
    updateChart1(category)
    updateChart2(category2)
}

function showChart(entry) {
    if (barChartDisplayed == true && prev == entry) {
        chartG.select('g.bar-chart').remove();
        prev = null;
        barChartDisplayed = false;
    } else {
        if (barChartDisplayed == true) {
            chartG.select('g.bar-chart').remove();
            prev = null;
            barChartDisplayed = false;
        }
        barxScale = d3.scaleLinear().range([0, barChartWidth]);
        var max = entry.movie_facebook_likes;
        if (entry.actor_1_facebook_likes > max) {
            max = entry.actor_1_facebook_likes;
        }
        if (entry.actor_2_facebook_likes > max) {
            max = entry.actor_2_facebook_likes;
        }
        if (entry.actor_3_facebook_likes > max) {
            max = entry.actor_3_facebook_likes;
        }
        if (entry.director_facebook_likes > max) {
            max = entry.director_facebook_likes;
        }
        if (entry.cast_total_facebook_likes > max) {
            max = entry.cast_total_facebook_likes;
        }
        barxScale.domain([0,max]);
        barxAxis = d3.axisBottom(barxScale).ticks(9).tickSize(-barChartHeight, 0, 0);

        newBarChart = chartG.append('g').attr('class', 'bar-chart')
        .attr('transform', 'translate('+[cellWidth + 120, 200]+')')
        newBarChart.append('text')
        .text(entry.movie_title)
        .attr('transform', 'translate('+[barChartWidth/2 - 80, 0]+')');

        barChartXAxis = newBarChart.append('g');
        barChartXAxis.attr('class', 'barx axis')
        .attr('transform', function() {
            return 'translate('+[0, barChartHeight]+')';
        })
        .call(barxAxis);

        actor1 = newBarChart.append('g').attr('class', 'bar')
        .attr('transform', function() {
            return 'translate('+[0, 3 + barBand * 0]+')';
        });
        actor1.append('rect')
        .attr('height', barHeight)
        .attr('width', function() {
            return barChartWidth * entry.actor_1_facebook_likes / max;
        })
        .attr('fill', 'blue')
        actor1.append('text')
        .attr('x', -110)
        .attr('y', barHeight/2)
        .text("actor_1_facebook_likes")

        actor2 = newBarChart.append('g').attr('class', 'bar')
        .attr('transform', function() {
            return 'translate('+[0, 3 + barBand * 1]+')';
        });
        actor2.append('rect')
        .attr('height', barHeight)
        .attr('width', function() {
            return barChartWidth * entry.actor_2_facebook_likes / max;
        })
        .attr('fill', 'blue')
        actor2.append('text')
        .attr('x', -110)
        .attr('y', barHeight/2)
        .text("actor_2_facebook_likes")

        actor3 = newBarChart.append('g').attr('class', 'bar')
        .attr('transform', function() {
            return 'translate('+[0, 3 + barBand * 2]+')';
        });
        actor3.append('rect')
        .attr('height', barHeight)
        .attr('width', function() {
            return barChartWidth * entry.actor_3_facebook_likes / max;
        })
        .attr('fill', 'blue')
        actor3.append('text')
        .attr('x', -110)
        .attr('y', barHeight/2)
        .text("actor_3_facebook_likes")

        director = newBarChart.append('g').attr('class', 'bar')
        .attr('transform', function() {
            return 'translate('+[0, 3 + barBand * 3]+')';
        });
        director.append('rect')
        .attr('height', barHeight)
        .attr('width', function() {
            return barChartWidth * entry.director_facebook_likes / max;
        })
        .attr('fill', 'blue')
        director.append('text')
        .attr('x', -110)
        .attr('y', barHeight/2)
        .text("director_facebook_likes")

        cast = newBarChart.append('g').attr('class', 'bar')
        .attr('transform', function() {
            return 'translate('+[0, 3 + barBand * 4]+')';
        });
        cast.append('rect')
        .attr('height', barHeight)
        .attr('width', function() {
            return barChartWidth * entry.cast_total_facebook_likes / max;
        })
        .attr('fill', 'blue')
        cast.append('text')
        .attr('x', -118)
        .attr('y', barHeight/2)
        .text("cast_total_facebook_likes")

        movief = newBarChart.append('g').attr('class', 'bar')
        .attr('transform', function() {
            return 'translate('+[0, 3 + barBand * 5]+')';
        });
        movief.append('rect')
        .attr('height', barHeight)
        .attr('width', function() {
            return barChartWidth * entry.movie_facebook_likes / max;
        })
        .attr('fill', 'blue')
        movief.append('text')
        .attr('x', -104)
        .attr('y', barHeight/2)
        .text("movie_facebook_likes")

        barChartDisplayed = true;
        prev = entry;
    }
}

function dataPreprocessor(row) {
    return {
        'duration': row['duration'],
        'aspect_ratio': +row['aspect_ratio'],
        'imdb_score': +row['imdb_score'],
        'budget': +row['budget'],
        'gross': +row['gross'],
        'num_user_for_reviews': +row['num_user_for_reviews'],
        'facenumber_in_poster': +row['facenumber_in_poster'],
        'movie_title': row['movie_title'],
        'num_voted_users': +row['num_voted_users'],
        'title_year': +row['title_year'],
        'actor_1_facebook_likes': +row['actor_1_facebook_likes'],
        'actor_2_facebook_likes': +row['actor_2_facebook_likes'],
        'actor_3_facebook_likes': +row['actor_3_facebook_likes'],
        'director_facebook_likes': +row['director_facebook_likes'],
        'cast_total_facebook_likes': +row['cast_total_facebook_likes'],
        'movie_facebook_likes': +row['movie_facebook_likes'],
        'content_rating': row['content_rating']
    };
}