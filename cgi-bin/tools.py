###
### Print Table
###
def print_table(t_d, t1, t2, t3, t4, t5, n):
    if "FAILURE" in t2 :
        print '<tr bgcolor="#ff5050">'
    elif "CANC" in t2 :
         print '<tr bgcolor="#a3a3c2">'
    elif t3 == "" :
        print '<tr bgcolor="#66ff66">'
    else:
        print '<tr>'
    if t3 == "":
        print '<th scope="row"><input type="checkbox" name="' + str(n) + '" id="' + str(n) + '" value="' + str(n) + '" v-model="checkedNames" /><input type="hidden" name="id_' + str(n) + '" value="' + t_d + '"/> </th>'
        t3 = "Current Doing"
    else:
        print '<th scope="row"></th>'
    print '<td>' +  str(n) + '</td>'
    print '<td>' +  t_d    + '</td>'
    print '<td>' +  t1     + '</td>'
    print '<td>' +  t2     + '</td>'
    print '<td>' +  t3     + '</td>'
    print '<td>' +  t4     + '</td>'
    print '<td><a href="' + t5 + '">' + t5 + '</a></td>'
    print '</tr>'


###
### Print Tools
###
def print_head(str_data_1, fn, message):
    print 'Content-type:text/html'
    print 
    print '<html lang="en">'
    print '<head>'
    print '<title>Stanford Medicine Service</title>'
    print '<meta charset="utf-8">'
    print '<meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">'
    
    print '<link href="https://fonts.googleapis.com/css?family=Nunito+Sans:200,300,400,600,700,800,900" rel="stylesheet">'
    print '<link rel="stylesheet" href="/css2/open-iconic-bootstrap.min.css">'
    print '<link rel="stylesheet" href="/css2/animate.css">'
    
    print '<link rel="stylesheet" href="/css2/owl.carousel.min.css">'
    print '<link rel="stylesheet" href="/css2/owl.theme.default.min.css">'
    print '<link rel="stylesheet" href="/css2/magnific-popup.css">'
    print '<link rel="stylesheet" href="/css2/aos.css">'
    print '<link rel="stylesheet" href="/css2/ionicons.min.css">'
    print '<link rel="stylesheet" href="/css2/bootstrap-datepicker.css">'
    print '<link rel="stylesheet" href="/css2/jquery.timepicker.css">'

    
    print '<link rel="stylesheet" href="/css2/flaticon.css">'
    print '<link rel="stylesheet" href="/css2/icomoon.css">'
    print '<link rel="stylesheet" href="/css2/style.css">'
    print '</head>'
    print '<body>'
    
    print '<nav class="navbar navbar-expand-lg navbar-dark ftco_navbar bg-dark ftco-navbar-light" id="ftco-navbar">'
    print '<div class="container">'
    print ' <a class="d-block" href="index.html" rel="home"><img class="d-block" src="/images/logo.png" alt="logo"></a>'
    print ' <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#ftco-nav" aria-controls="ftco-nav" aria-expanded="false" aria-label="Toggle navigation">'
    print ' <span class="oi oi-menu"></span> Menu'
    print ' </button>'
    print ' <div class="collapse navbar-collapse" id="ftco-nav">'
    print '<ul class="navbar-nav ml-auto">'
    print '<li class="nav-item cta mr-md-1"><form class="nav-link" enctype="multipart/form-data" action="/cgi-bin/backend_get.py"  method="post"><input type = "submit" class="btn btn-primary" value="Tools"/><input type="hidden" name="data_1" value="' + str_data_1 + '"/><input type="hidden" name="fn" value="' + fn + '"/></form></li>'
    print '<li class="nav-item cta cta-colored"><form enctype="multipart/form-data" action="/cgi-bin/monitor.py" class="nav-link" method="post"><input class="btn btn-primary" type = "submit" value="Monitor"/><input type="hidden" name="data_1" value="' + str_data_1 + '"/><input type="hidden" name="fn" value="' + fn + '"/></form></li>'
    print '<li class="nav-item cta cta-colored"><a href="/index.html" class="nav-link">Logout</a></li>'
    print '</ul></div></div></nav><!-- END nav -->'

    print '<div class="hero-wrap ">'
    print '<div class="container">'
    print '<div class=" slider-text  ">'
    print '<div class="col-12   justify-content-between align-items-center">'
    print '<div class="text "><Br><Br><Br><Br>'
    print '<div style=";margin:0 60px 0 50px"><h2 >Service: ' + message + '</h2>'
    print '<div class="ftco-search">'
    print '     <div class="row">'
    print '		<div class="col-md-12 tab-wrap">'

###
### Print Back
###
def print_back(type=1):

    print '</div>'
    print '<div class="tab-pane fade" id="v-pills-2" role="tabpanel" aria-labelledby="v-pills-performance-tab">\
    				              	<form action="#" class="search-job">\
    				              		<div class="row">\
				              			<div class="col-md">\
				              				<div class="form-group">\
					              				<div class="form-field">\
					              					<div class="icon"><span class="icon-user"></span></div>\
									                <input type="text" class="form-control" placeholder="eg. Adam Scott">\
									              </div>\
								              </div>\
				              			</div>\
    				              			<div class="col-md">\
				              				<div class="form-group">\
				              					<div class="form-field">\
									                <button type="submit" class="form-control btn btn-secondary">Submit a Job</button>\
									              </div>\
								              </div>\
				              			</div>\
								<Br><Br><Br>\
								<HR style="border:3 double #987cb9" width="100%" color=#987cb9 SIZE=3>\
				              		</div>\
				              	</form>\
				              </div>\
				            </div>\
				          </div>\
				        </div>\
					</div>\
			        </div>\
	        </div>\
	    	</div>\
      </div>\
	</div>\
    </div>\
    <footer class="footer">\
	<div class="footer-widgets">\
	    <div class="container">\
		<div class="row">\
		    <div class="col-12 col-md-6 col-lg-4">\
			<div class="foot-about">\
			    <h2><a href="#"><img src="/images/logo.png" alt=""></a></h2>\
                            <p>Gemone Service.</p>\
                            <p class="footer">\
Copyright &copy;<script>document.write(new Date().getFullYear());</script> All rights reserved | by <a href="https://colorlib.com/" target="_blank">Colorlib</a></p>\
                        </div><!-- .foot-about -->\
                    </div><!-- .col -->\
                    <div class="col-12 col-md-6 col-lg-4 mt-5 mt-md-0">\
    			    <div class="foot-contact">\
	    			    <h2>Contact</h2>\
                            <ul class="p-0 m-0">\
                                <li><span>Addtress:</span> 3165 Porter Drive, Palo Alto, California, US</li>\
                                <li><span>Phone:</span>+1 7657750242</li>\
				<li><span>Email:</span>zhfuyang@stanford.edu</li>\
                            </ul>\
                        </div>\
                    </div>\
	       	</div><!-- .row -->\
            </div><!-- .container -->\
        </div><!-- .footer-widgets -->\
    </footer><!-- .site-footer -->'
    print '<script src="https://cdn.staticfile.org/vue/2.2.2/vue.min.js"></script>' 
    if type <> 1:
        strs =  '         checkedArr: ["1"' 
        print "<script>new Vue({"
        print "     el: '#app',"
        print "     data: {"
        print "         checked: false,"
        print "         checkedNames: [],"
        for i in range(2,type):
            strs = strs + ',"' + str(i) + '"'
        strs = strs + ']'
        print strs 
        print "     },"
        print "     methods: {"
        print "         changeAllChecked: function() {"
        print "             if (this.checked) {"
        print "                 this.checkedNames = this.checkedArr"
        print "             } else {"
        print "                 this.checkedNames = []"
        print "             }"
        print "         }"
        print "     }"
        print " })</script>"

    print '<script type="text/javascript" src="/js2/jquery.js"></script>\
    <script type="text/javascript" src="/js2/jquery.collapsible.min.js"></script>\
    <script type="text/javascript" src="/js2/swiper.min.js"></script>\
    <script type="text/javascript" src="/js2/jquery.countdown.min.js"></script>\
    <script type="text/javascript" src="/js2/circle-progress.min.js"></script>\
    <script type="text/javascript" src="/js2/jquery.countTo.min.js"></script>\
    <script type="text/javascript" src="/js2/jquery.barfiller.js"></script>\
    <script type="text/javascript" src="/js2/custom.js"></script><!-- loader -->\
  <div id="ftco-loader" class="show fullscreen"><svg class="circular" width="48px" height="48px"><circle class="path-bg" cx="24" cy="24" r="22" fill="none" stroke-width="4" stroke="#eeeeee"/><circle class="path" cx="24" cy="24" r="22" fill="none" stroke-width="4" stroke-miterlimit="10" stroke="#F96D00"/></svg></div>\
  <script src="/js2/jquery.min.js"></script>\
  <script src="/js2/jquery-migrate-3.0.1.min.js"></script>\
  <script src="/js2/popper.min.js"></script>\
  <script src="/js2/bootstrap.min.js"></script>\
  <script src="/js2/jquery.easing.1.3.js"></script>\
  <script src="/js2/jquery.waypoints.min.js"></script>\
  <script src="/js2/jquery.stellar.min.js"></script>\
  <script src="/js2/owl.carousel.min.js"></script>\
  <script src="/js2/jquery.magnific-popup.min.js"></script>\
  <script src="/js2/aos.js"></script>\
  <script src="/js2/jquery.animateNumber.min.js"></script>\
  <script src="/js2/scrollax.min.js"></script>\
  <script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyBVWaKrjvy3MaE7SQ74_uJiULgl1JY0H2s&sensor=false"></script>\
  <script src="/js2/google-map.js"></script>\
  <script src="/js2/main.js"></script>\
  </body>\
</html>'



