$(function () {

  const $modal = $("#createModal");

  function openModal() {
    $modal.show();
    $("#modal-title").focus();
             }

      function closeModal() {
    $modal.hide();
    $("#modal-title, #modal-card").val("");
    }

  $(".create").on("click", openModal);
        $("#modal-cancel").on("click", closeModal);

                    $("#modal-ok").on("click", function () {
             const title = $("#modal-title").val().trim();
                const text  = $("#modal-card").val().trim();

    if (!title) {
      alert("Enter list title");
      return;
    }

    createColumn(title, text);
    closeModal();
    });


    // 🟡 ساخت ستون (Column)

  function createColumn(title, firstCardText) {
    const id = "col-" + Date.now();
    const $col = $("<div>")
      .addClass("column")
      .attr("id", id)
      .attr("draggable", true);

    // عنوان ستون
    const $header = $("<div>")
      .addClass("column-header")
      .text(title);

    // دوبار کلیک برای ویرایش عنوان
    $header.on("dblclick", () => $header.attr("contenteditable", true).focus());
    $header.on("blur", () => $header.removeAttr("contenteditable"));
    $header.on("keydown", (e) => {
      if (e.key === "Enter") $header.blur();
    });

    // ناحیه کارت‌ها
    const $cards = $("<div>").addClass("cards");

    // اگر کارت اولیه داده شده بود
    if (firstCardText) $cards.append(createCard(firstCardText));

    // دکمه افزودن کارت
    const $addBtn = $("<div>")
      .addClass("add-card")
      .text("+ Add card")
      .on("click", () => showCardInput($col));

    // چسباندن بخش‌ها به هم
    $col.append($header, $cards, $addBtn);
    $("#board").append($col);

    // فعال‌سازی درگ ستون
    addColumnDrag($col);
  }


  // =======================
  // 🧩 ساخت کارت (Card)
  // =======================
  function createCard(text) {
    const id = "card-" + Date.now();
    const $card = $("<div>")
      .addClass("card")
      .attr("id", id)
      .attr("draggable", true);

    const $text = $("<span>")
      .addClass("card-text")
      .text(text);

    const $deleteBtn = $("<button>")
      .addClass("delete-card")
      .html("❌")
      .on("click", function (e) {
        e.stopPropagation();
        $card.remove();
      });

    // ادیت متن کارت
    $text.on("dblclick", () => $text.attr("contenteditable", true).focus());
    $text.on("blur", () => $text.removeAttr("contenteditable"));
    $text.on("keydown", (e) => {
      if (e.key === "Enter") $text.blur();
    });

    // اضافه کردن متن و دکمه حذف
    $card.append($text, $deleteBtn);

    // فعال‌سازی درگ کارت
    addCardDrag($card);
    return $card;
  }


  // =======================
  // 🟣 ورودی اضافه کردن کارت جدید
  // =======================
  function showCardInput($col) {
    if ($col.find(".add-card-input").length) return;

    const $input = $('<input>')
      .addClass('add-card-input')
      .attr('placeholder', 'Card text');

    const $addBtn = $('<button>').text('Add');
    const $cancel = $('<button>').text('Cancel');

    const $btnGroup = $('<div>')
      .addClass('add-card-buttons')
      .append($addBtn, $cancel);

    const $wrap = $('<div>')
      .addClass('add-card-wrap')
      .append($input, $btnGroup);

    $col.find('.add-card').hide().after($wrap);
    $input.focus();

    function cleanup() {
      $wrap.remove();
      $col.find('.add-card').show();
    }

    $cancel.on('click', cleanup);
    $addBtn.on('click', function () {
      const val = $input.val().trim();
      if (!val) return;
      $col.find('.cards').append(createCard(val));
      cleanup();
    });

    $input.on('keydown', function (e) {
      if (e.key === 'Enter') $addBtn.click();
      else if (e.key === 'Escape') cleanup();
    });
  }


  // =======================
  // 🟤 درگ و دراپ کارت‌ها
  // =======================

  // فعال‌سازی درگ برای کارت
  function addCardDrag($card) {
    $card.on("dragstart", function (e) {
      e.originalEvent.dataTransfer.setData("type", "card");
      e.originalEvent.dataTransfer.setData("id", this.id);
      $(this).addClass("dragging");
    });

    $card.on("dragend", function () {
      $(this).removeClass("dragging");
    });
  }

  // وقتی روی کارت دیگری درگ می‌کنیم
  $(document).on("dragover", ".card", function (e) {
    e.preventDefault();

    const $dragging = $(".dragging");
    const $target = $(this);
    const offsetY = e.originalEvent.offsetY;

    // اگر موس در نیمه بالای کارت است → بالا
    // اگر پایین است → پایین
    if (offsetY < $target.height() / 2) {
      $target.before($dragging);
    } else {
      $target.after($dragging);
    }
  });

  // وقتی روی فضای خالی ستون دراپ می‌کنیم
  $(document).on("dragover", ".cards", function (e) {
    e.preventDefault();
  });

  $(document).on("drop", ".cards", function (e) {
    e.preventDefault();
    const type = e.originalEvent.dataTransfer.getData("type");
    const id = e.originalEvent.dataTransfer.getData("id");

    if (type === "card") {
      const $target = $(e.target);
      const $card = $("#" + id);
      if (!$target.hasClass("card")) {
        $(this).append($card);
      }
    }
  });


  // =======================
  // ⚫ درگ ستون‌ها
  // =======================
  function addColumnDrag($col) {
    $col.on("dragstart", function (e) {
      e.originalEvent.dataTransfer.setData("type", "column");
      e.originalEvent.dataTransfer.setData("id", this.id);
    });
  }

  $(document).on("dragover", "#board", function (e) {
    e.preventDefault();
  });

  $(document).on("drop", "#board", function (e) {
    e.preventDefault();
    const type = e.originalEvent.dataTransfer.getData("type");
    const id = e.originalEvent.dataTransfer.getData("id");
    if (type === "column") $(this).append($("#" + id));
  });


 

});
