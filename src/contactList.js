import $ from './jquery-3.2.1.js';

var list = [];
var originallist = [];

$(document).ready(function () {
  $.getJSON('contactList.json', function (data) {
    var contact = "";
    originallist = data.contactList;
    $('#contacts').empty;

    var LastName = [];
    for (var n in originallist) {
      LastName.push([originallist[n].lastName, n]);
    }
    LastName.sort();
    showAndSortContact(LastName)
  })

  //在main html的list部分添加li元素进行显示
  function showAndSortContact(LastName) {
    $('#contacts').empty();
    for (let i = 0; i < LastName.length; i++) {
      var p = originallist[LastName[i][1]];
      list[i] = $('<li>').addClass('contact').html(p.firstName + ' ' + LastName[i][0] + ' ');

      var detail = $('<div id="viewDetail' + i + '">').addClass('view');
      $(detail).css('display', 'none')
      list[i].append(detail);
      var table = $('<table>').addClass('contactDetail');
      table.appendTo(detail);

      let showBtn = '<button id="showBtn' + i + '" type="button" class="showDetail' + i + ' showButton">show detail</button>'
      list[i].append(showBtn);
      let closeBtn = '<button id="closeBtn' + i + '" type="button" class="closeDetail' + i + ' closeButton">close detail</button>'
      list[i].append(closeBtn);

      var phoneNumberTr = $('<tr id="phoneNo">');
      var addressTr = $('<tr id="address">');
      var pictureTr = $('<tr id="photo">');
      var birthdayTr = $('<tr id="birthday">');
      table.append(phoneNumberTr).append(birthdayTr).append(addressTr).append(pictureTr);

      var phoneNumberTd = $('<td class="phoneNumber">');
      phoneNumberTr.append(phoneNumberTd).text("Phone Number : " + " " + p.phoneNumber);
      var birthdayTd = $('<td class="birthday">');
      birthdayTr.append(birthdayTd).text("Birthday : " + " " + p.birthday);
      var addressTd = $('<td class="address">');
      addressTr.append(addressTd).text("Address : " + " " + p.address);
      var img = $("<img>").attr("src", p.photo).addClass('picture');
      img.appendTo(pictureTr);

    }

    list.forEach(function (a) {
      $('.contactList').append(a);
    });

    for (let i = 0; i < LastName.length; i++) {
      document.getElementById("showBtn" + i).addEventListener('click', function () {
        document.getElementById("viewDetail" + i).style.display = "block"
      })
      document.getElementById("closeBtn" + i).addEventListener('click', function () {
        document.getElementById("viewDetail" + i).style.display = "none"
      })
    }
  }


  //create new contact page show
  var addButton = document.getElementById('add-anchor'),
    addContactListener = function (evt) {
      //Send AJAX call to get the sticky dom.
      var newContactRequest = new XMLHttpRequest();
      newContactRequest.open('GET', 'createContact.html', true);
      newContactRequest.responseType = 'text';
      newContactRequest.onload = function (e) {
        if (this.status == 200) {
          createContact(this.responseText);
        }
      };
      newContactRequest.send();
    };
  //Add click event handler/listener
  if (addButton) {
    addButton.addEventListener('click', addContactListener);
  }


  /* Creates new contact with the contact dom string.*/
  var createContact = function (contactDom) {

    var createArea = document.querySelector('.create-area'),
      viewArea = document.querySelector('.view-area'),
      divCreate = document.createElement('div'),
      divView = document.createElement('div');
    divCreate.classList.add('newContact');
    //Set dom
    divCreate.innerHTML = contactDom;
    //Add new sticky to sticky area
    createArea.appendChild(divCreate);
    $(".create-area").css("display", "block");

    //submit and add data to the array
    var submitButton = document.getElementById('submit'),
      cancelButton = document.getElementById("cancel"),
      submitPostListener = function (evt) {
        var firstName = document.getElementById('createFN').innerHTML,
          lastName = document.getElementById('createLN').innerHTML,
          birthday = document.getElementById('createB').innerHTML,
          address = document.getElementById('createA').innerHTML,
          phoneNumber = document.getElementById('createP').innerHTML,
          photo = document.getElementById('createPh').innerHTML;

        if (firstName == "" || lastName == "" || birthday == "" || address == "" || phoneNumber == "" || photo == "") {
          alert("You need to fill all the fields!")
        } else {
          var contactObj = jsonChange(firstName, lastName, birthday, phoneNumber, address, photo);
          originallist.push(contactObj);
          var LastName = [];
          for (let n in originallist) {
            LastName.push([originallist[n].lastName, n]);
          }
          LastName.sort();
          showAndSortContact(LastName);

          $(".newContact").remove();
        }

      };

    function jsonChange(firstName, lastName, birthday, phoneNumber, address, photo) {
      var temp = {};
      temp.firstName = firstName;
      temp.lastName = lastName;
      temp.birthday = birthday;
      temp.phoneNumber = phoneNumber;
      temp.address = address;
      temp.photo = photo;
      return temp;
    }

    submitButton.addEventListener('click', submitPostListener);
    cancelButton.addEventListener('click', function () {
      $(".create-area").css("display", "none");
    })
  }
});
