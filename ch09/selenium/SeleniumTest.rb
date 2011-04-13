require "test/unit"
require "rubygems"
gem "selenium-client"
require "selenium/client"

class SeleniumTest < Test::Unit::TestCase

  def setup
    @verification_errors = []
    @selenium = Selenium::Client::Driver.new \
      :host => "localhost",
      :port => 4444,
      :browser => "*chrome",
      :url => "file:///Users/Alex/book/assets/ch09/selenium/index.html",
      :timeout_in_second => 60

    @selenium.start_new_browser_session
  end
  
  def teardown
    @selenium.close_current_browser_session
    assert_equal [], @verification_errors
  end
  
  def test_selenium
    @selenium.open "file:///Users/Alex/book/assets/ch09/selenium/index.html"
    @selenium.click "link=Login.html"
    @selenium.wait_for_page_to_load "30000"
    @selenium.type "email", "test@example.com"
    @selenium.type "password", "test"
    @selenium.click "//input[@value='Continue →']"
    @selenium.wait_for_page_to_load "30000"
  end
end
