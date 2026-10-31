/* ==========================================================================
   ASSIGNMENT #6 — TASK 1: SELECTOR DETECTIVE (SELECTORS & TRAVERSAL)
   Student: Aitpayev Tamerlan (IT-2510) | Astana IT University
   Strict Rule 5 Compliance: 100% jQuery behavior, zero inline onclick,
   zero CSS transitions/animations, one single jQuery chain per case.
   ========================================================================== */

$(function () {
  'use strict';

  /* ------------------------------------------------------------------------
     1. THE PARTY ARRAY (Exact match to "The Party, 19:30 - 22:30" picture)
     ------------------------------------------------------------------------ */
  const PARTY_DATA = [
    {
      name: 'Balcony',
      slug: 'balcony',
      floor: 2,
      guests: [
        { name: 'Aigerim', color: 'yellow', time: '20:45', aitu: true,  things: ['crumbs', 'bag'] },
        { name: 'Aliya',   color: 'green',  time: '21:15', aitu: true,  things: ['phone', 'cup'] },
        { name: 'Madina',  color: 'purple', time: '22:10', aitu: false, things: ['phone', 'bag', 'crumbs'] },
        { name: 'Ivan',    color: 'black',  time: '20:10', aitu: false, things: ['bag'] }
      ]
    },
    {
      name: 'Hall',
      slug: 'hall',
      floor: 2,
      guests: [
        { name: 'Arman',   color: 'red',    time: '20:35', aitu: false, things: ['bag', 'glasses'] },
        { name: 'Sophia',  color: 'yellow', time: '21:30', aitu: false, things: ['phone'] },
        { name: 'Dias',    color: 'green',  time: '19:45', aitu: false, things: [] },
        { name: 'Bekzat',  color: 'purple', time: '20:55', aitu: true,  things: ['bag', 'cup', 'crumbs'] },
        { name: 'Aruzhan', color: 'blue',   time: '21:50', aitu: true,  things: ['phone'] },
        { name: 'Saule',   color: 'red',    time: '21:25', aitu: false, things: ['glasses'] }
      ]
    },
    {
      name: 'Kitchen',
      slug: 'kitchen',
      floor: 1,
      guests: [
        { name: 'Nurlan',  color: 'red',    time: '19:40', aitu: true,  things: ['phone', 'bag'] },
        { name: 'Emma',    color: 'yellow', time: '20:15', aitu: false, things: ['bag'] },
        { name: 'Timur',   color: 'green',  time: '21:05', aitu: false, things: ['phone', 'bag', 'crumbs'] },
        { name: 'Sergey',  color: 'black',  time: '20:50', aitu: false, things: [] },
        { name: 'Yerlan',  color: 'purple', time: '21:40', aitu: false, things: ['glasses', 'phone'] },
        { name: 'Kamila',  color: 'blue',   time: '20:05', aitu: false, things: ['bag'] }
      ]
    },
    {
      name: 'Living room',
      slug: 'living-room',
      floor: 1,
      guests: [
        { name: 'Daniel',  color: 'blue',   time: '19:55', aitu: true,  things: ['glasses'] },
        { name: 'Zarina',  color: 'yellow', time: '21:10', aitu: false, things: ['bag', 'phone', 'crumbs'] },
        { name: 'Natasha', color: 'green',  time: '20:30', aitu: false, things: [] },
        { name: 'Askar',   color: 'black',  time: '21:00', aitu: true,  things: ['phone'] },
        { name: 'Inkar',   color: 'purple', time: '20:20', aitu: false, things: ['bag'] }
      ]
    }
  ];

  /* ------------------------------------------------------------------------
     SVG ICON DEFINITIONS (Phone, Glasses, Bag, Cup, Cake crumbs, Clock, AITU)
     ------------------------------------------------------------------------ */
  const ICONS = {
    phone: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="6" y="2" width="12" height="20" rx="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>',
    glasses: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="6" cy="14" r="4"/><circle cx="18" cy="14" r="4"/><path d="M10 14h4"/></svg>',
    bag: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 7h12l1 13H5L6 7z"/><path d="M9 7V5a3 3 0 0 1 6 0v2"/></svg>',
    cup: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 8h1a4 4 0 1 1 0 8h-1"/><path d="M3 8h14v7a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V8z"/></svg>',
    crumbs: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 18h16v-5L12 6 4 13v5z"/><line x1="4" y1="14" x2="20" y2="14"/><circle cx="12" cy="5" r="1.5"/></svg>',
    clock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><polyline points="12 7 12 12 15 15"/></svg>',
    aitu: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 10L12 5 2 10l10 5 10-5z"/><path d="M6 12v5c3 2 9 2 12 0v-5"/></svg>'
  };

  /* ------------------------------------------------------------------------
     2. BUILD THE PAGE FROM THE ARRAY WITH jQUERY
     Creates guest cards with avatar (DiceBear Open Peeps), color ring, name,
     arrival time, item icons, AITU badge, classes, and data-* attributes.
     ------------------------------------------------------------------------ */
  function createGuestCardElement(guest, roomSlug, floorNum) {
    const classes = [
      'guest-card',
      'color-' + guest.color,
      guest.aitu ? 'is-aitu' : 'not-aitu',
      guest.things.length === 0 ? 'no-things' : 'has-things'
    ];
    $.each(guest.things, function (_, thing) {
      classes.push('has-' + thing);
    });

    const $card = $('<article></article>')
      .addClass(classes.join(' '))
      .attr({
        'data-name': guest.name,
        'data-color': guest.color,
        'data-time': guest.time,
        'data-aitu': String(guest.aitu),
        'data-things': guest.things.join(','),
        'data-room': roomSlug,
        'data-floor': String(floorNum)
      });

    const avatarUrl = 'https://api.dicebear.com/9.x/open-peeps/svg?seed=' + encodeURIComponent(guest.name);
    const $avatarWrap = $('<div class="avatar-wrapper"></div>');
    const $ring = $('<div class="avatar-ring"></div>').append(
      $('<img class="guest-avatar" alt="">')
        .attr('src', avatarUrl)
        .attr('alt', guest.name)
    );
    $avatarWrap.append($ring);

    if (guest.aitu) {
      $avatarWrap.append(
        $('<span class="aitu-badge" title="AITU Student"></span>').html(ICONS.aitu)
      );
    }

    const $name = $('<div class="guest-name"></div>').text(guest.name);
    const $time = $('<div class="guest-time"></div>')
      .append(ICONS.clock)
      .append($('<span></span>').text(guest.time));

    const $things = $('<div class="guest-things"></div>');
    $.each(guest.things, function (_, thing) {
      if (ICONS[thing]) {
        $things.append(
          $('<span></span>')
            .addClass('thing-icon thing-' + thing)
            .attr('title', thing)
            .html(ICONS[thing])
        );
      }
    });

    return $card.append($avatarWrap, $name, $time, $things);
  }

  function buildPartyPage() {
    const $house = $('#party-house').empty();

    $.each([2, 1], function (_, floorNum) {
      const $floorRow = $('<div class="floor-row"></div>')
        .attr('id', 'floor-' + floorNum)
        .attr('data-floor', floorNum);

      const $floorLabel = $('<div class="floor-label-bar"></div>')
        .text('FLOOR ' + floorNum);

      const $roomsGrid = $('<div class="floor-rooms"></div>');

      $.each(PARTY_DATA, function (_, roomObj) {
        if (roomObj.floor === floorNum) {
          const $room = $('<section class="room"></section>')
            .attr({
              'id': 'room-' + roomObj.slug,
              'data-room': roomObj.slug,
              'data-room-name': roomObj.name,
              'data-floor': floorNum
            });

          const $header = $('<div class="room-header"></div>').append(
            $('<div class="room-title-wrap"></div>').append(
              $('<h2 class="room-name"></h2>').text(roomObj.name),
              $('<span class="room-count-badge"></span>').text(roomObj.guests.length + ' guests')
            )
          );

          const $guestsWrap = $('<div class="room-guests"></div>');
          $.each(roomObj.guests, function (_, guestObj) {
            $guestsWrap.append(createGuestCardElement(guestObj, roomObj.slug, floorNum));
          });

          $room.append($header, $guestsWrap);
          $roomsGrid.append($room);
        }
      });

      $floorRow.append($floorLabel, $roomsGrid);
      $house.append($floorRow);
    });
  }

  function renderLegendBar() {
    const $legend = $('#party-legend').empty();

    const $colorsGroup = $('<div class="legend-group"></div>');
    const $dots = $('<span class="color-dots"></span>');
    $.each(['#2563eb', '#9333ea', '#16a34a', '#dc2626', '#1e293b', '#eab308'], function (_, hex) {
      $dots.append($('<span class="color-dot"></span>').css('background-color', hex));
    });
    $colorsGroup.append($dots, $('<span>Clothing color</span>'));

    const $itemsGroup = $('<div class="legend-group"></div>');
    const legendItems = [
      { key: 'phone', label: 'Phone' },
      { key: 'glasses', label: 'Glasses' },
      { key: 'bag', label: 'Bag' },
      { key: 'cup', label: 'Cup' },
      { key: 'crumbs', label: 'Cake crumbs' }
    ];
    $.each(legendItems, function (_, item) {
      $itemsGroup.append(
        $('<span class="legend-item"></span>')
          .append(ICONS[item.key])
          .append($('<span></span>').text(item.label))
      );
    });

    const $metaGroup = $('<div class="legend-group"></div>');
    $metaGroup.append(
      $('<span class="legend-item"></span>').append(ICONS.clock).append('<span>Arrival time</span>'),
      $('<span class="legend-item"></span>')
        .append($('<span class="aitu-badge" style="position:static;width:18px;height:18px;display:inline-flex;"></span>').html(ICONS.aitu))
        .append('<span>AITU student</span>')
    );

    $legend.append($colorsGroup, $itemsGroup, $metaGroup);
  }

  /* ------------------------------------------------------------------------
     3 & 4. ALL 20 CASES SOLVED WITH ONE jQUERY CHAIN SEARCHING THE PAGE
     Each case defines its exact title, single jQuery selector/traversal chain
     display string, and executeChain() returning the matched jQuery collection.
     ------------------------------------------------------------------------ */
  const CASES = [
    {
      id: 1,
      title: 'Who is in the hall?',
      type: 'guests',
      chainText: "$('#room-hall .guest-card')",
      execute: function () {
        return $('#room-hall .guest-card');
      }
    },
    {
      id: 2,
      title: 'Who is dressed in yellow or purple?',
      type: 'guests',
      chainText: "$('.guest-card.color-yellow, .guest-card.color-purple')",
      execute: function () {
        return $('.guest-card.color-yellow, .guest-card.color-purple');
      }
    },
    {
      id: 3,
      title: 'Which AITU students are upstairs?',
      type: 'guests',
      chainText: "$('#floor-2 .guest-card.is-aitu')",
      execute: function () {
        return $('#floor-2 .guest-card.is-aitu');
      }
    },
    {
      id: 4,
      title: 'Who has glasses or a bag?',
      type: 'guests',
      chainText: "$('.guest-card:has(.thing-glasses, .thing-bag)')",
      execute: function () {
        return $('.guest-card:has(.thing-glasses, .thing-bag)');
      }
    },
    {
      id: 5,
      title: 'Who came with nothing at all?',
      type: 'guests',
      chainText: "$('.guest-card:not(:has(.thing-icon))')",
      execute: function () {
        return $('.guest-card:not(:has(.thing-icon))');
      }
    },
    {
      id: 6,
      title: 'Who has a phone but no bag?',
      type: 'guests',
      chainText: "$('.guest-card:has(.thing-phone):not(:has(.thing-bag))')",
      execute: function () {
        return $('.guest-card:has(.thing-phone):not(:has(.thing-bag))');
      }
    },
    {
      id: 7,
      title: 'Who arrived between 20:30 and 21:00, both times included?',
      type: 'guests',
      chainText: "$('.guest-card').filter((_, el) => $(el).attr('data-time') >= '20:30' && $(el).attr('data-time') <= '21:00')",
      execute: function () {
        return $('.guest-card').filter((_, el) => $(el).attr('data-time') >= '20:30' && $(el).attr('data-time') <= '21:00');
      }
    },
    {
      id: 8,
      title: 'Who arrived after 21:00 and is not an AITU student?',
      type: 'guests',
      chainText: "$('.guest-card:not(.is-aitu)').filter((_, el) => $(el).attr('data-time') > '21:00')",
      execute: function () {
        return $('.guest-card:not(.is-aitu)').filter((_, el) => $(el).attr('data-time') > '21:00');
      }
    },
    {
      id: 9,
      title: 'Who stands right next to Askar?',
      type: 'guests',
      chainText: "$('.guest-card[data-name=\"Askar\"]').prev().add($('.guest-card[data-name=\"Askar\"]').next())",
      execute: function () {
        return $('.guest-card[data-name="Askar"]').prev().add($('.guest-card[data-name="Askar"]').next());
      }
    },
    {
      id: 10,
      title: 'Who stands last in each room?',
      type: 'guests',
      chainText: "$('.room .guest-card:last-child')",
      execute: function () {
        return $('.room .guest-card:last-child');
      }
    },
    {
      id: 11,
      title: 'Who stands third in each room?',
      type: 'guests',
      chainText: "$('.room .guest-card:nth-child(3)')",
      execute: function () {
        return $('.room .guest-card:nth-child(3)');
      }
    },
    {
      id: 12,
      title: 'Who stands after Timur in his room?',
      type: 'guests',
      chainText: "$('.guest-card[data-name=\"Timur\"]').nextAll()",
      execute: function () {
        return $('.guest-card[data-name="Timur"]').nextAll();
      }
    },
    {
      id: 13,
      title: 'Who stands right before someone in black?',
      type: 'guests',
      chainText: "$('.guest-card.color-black').prev()",
      execute: function () {
        return $('.guest-card.color-black').prev();
      }
    },
    {
      id: 14,
      title: 'In which room is Aruzhan?',
      type: 'rooms',
      chainText: "$('.guest-card[data-name=\"Aruzhan\"]').closest('.room')",
      execute: function () {
        return $('.guest-card[data-name="Aruzhan"]').closest('.room');
      }
    },
    {
      id: 15,
      title: 'Which rooms have fewer than 6 guests?',
      type: 'rooms',
      chainText: "$('.room:not(:has(.guest-card:nth-child(6)))')",
      execute: function () {
        return $('.room:not(:has(.guest-card:nth-child(6)))');
      }
    },
    {
      id: 16,
      title: 'In which rooms does somebody have a cup, but nobody wears glasses?',
      type: 'rooms',
      chainText: "$('.room:has(.thing-cup):not(:has(.thing-glasses))')",
      execute: function () {
        return $('.room:has(.thing-cup):not(:has(.thing-glasses))');
      }
    },
    {
      id: 17,
      title: 'Who came first to each room?',
      type: 'guests',
      chainText: "$('.guest-card').filter((_, el) => $(el).siblings().filter((_, s) => $(s).attr('data-time') < $(el).attr('data-time')).length === 0)",
      execute: function () {
        return $('.guest-card').filter((_, el) => $(el).siblings().filter((_, s) => $(s).attr('data-time') < $(el).attr('data-time')).length === 0);
      }
    },
    {
      id: 18,
      title: 'Miras, an AITU student in blue, comes at 21:20 with his phone and joins Askar and Inkar, standing between them. Let him appear smoothly.',
      type: 'mutation-add',
      chainText: "createGuestCardElement({name:'Miras',color:'blue',time:'21:20',aitu:true,things:['phone']},'living-room',1).hide().insertAfter('.guest-card[data-name=\"Askar\"]').fadeIn(400)",
      execute: function () {
        return createGuestCardElement(
          { name: 'Miras', color: 'blue', time: '21:20', aitu: true, things: ['phone'] },
          'living-room',
          1
        )
          .hide()
          .insertAfter('.guest-card[data-name="Askar"]')
          .fadeIn(400);
      }
    },
    {
      id: 19,
      title: 'Natasha says goodbye and goes home. Her card fades away and disappears from the page.',
      type: 'mutation-remove',
      chainText: "$('.guest-card[data-name=\"Natasha\"]').fadeOut(400, function() { $(this).remove(); })",
      execute: function () {
        return $('.guest-card[data-name="Natasha"]').fadeOut(400, function () {
          const $room = $(this).closest('.room');
          $(this).remove();
          $room.find('.room-count-badge').text($room.find('.guest-card').length + ' guests');
        });
      }
    },
    {
      id: 20,
      title: 'Who took the cake? The thief was downstairs, came after 21:00 but before the cake disappeared, has crumbs but no cup, and stood right next to an AITU student.',
      type: 'thief',
      chainText: "$('#floor-1 .guest-card:has(.thing-crumbs):not(:has(.thing-cup))').filter((_, el) => $(el).attr('data-time') > '21:00' && $(el).attr('data-time') < '21:30' && $(el).prev().add($(el).next()).is('.is-aitu'))",
      execute: function () {
        return $('#floor-1 .guest-card:has(.thing-crumbs):not(:has(.thing-cup))').filter(
          (_, el) =>
            $(el).attr('data-time') > '21:00' &&
            $(el).attr('data-time') < '21:30' &&
            $(el).prev().add($(el).next()).is('.is-aitu')
        );
      }
    }
  ];

  /* ------------------------------------------------------------------------
     JUMP ONCE ANIMATION WITH jQuery animate()
     ------------------------------------------------------------------------ */
  function jumpGuests($guests) {
    $guests
      .stop(true, true)
      .css('top', '0px')
      .animate({ top: '-16px' }, 160)
      .animate({ top: '0px' }, 180);
  }

  /* ------------------------------------------------------------------------
     EXECUTE A DETECTIVE CASE (Rebuilds page first, runs chain, updates UI)
     ------------------------------------------------------------------------ */
  function runCase(caseObj) {
    // Requirement 4: "Before every case, build the page again"
    buildPartyPage();

    $('.btn-case').removeClass('is-active');
    $('#btn-case-' + caseObj.id).addClass('is-active');

    $('#status-title').text('Case #' + caseObj.id + ': ' + caseObj.title);
    $('#status-chain').text(caseObj.chainText);

    const $found = caseObj.execute();

    if (caseObj.type === 'rooms') {
      $found.addClass('is-found-room');
      const roomNames = $found
        .map(function () {
          return $(this).attr('data-room-name');
        })
        .get();

      const $guestsInRooms = $found.find('.guest-card').addClass('is-found');
      jumpGuests($guestsInRooms);

      $('#status-result').html(
        'Found <strong>' +
          roomNames.length +
          (roomNames.length === 1 ? ' room' : ' rooms') +
          '</strong>: <strong>' +
          roomNames.join(', ') +
          '</strong> (' +
          $guestsInRooms.length +
          ' guests inside: ' +
          $guestsInRooms
            .map(function () {
              return $(this).attr('data-name');
            })
            .get()
            .join(', ') +
          ')'
      );
    } else if (caseObj.type === 'mutation-add') {
      $found.addClass('is-found');
      jumpGuests($found);
      const $room = $found.closest('.room');
      $room.find('.room-count-badge').text($room.find('.guest-card').length + ' guests');

      $('#status-result').html(
        'Added <strong>1 guest</strong>: <strong>Miras</strong> joined Living room between Askar and Inkar (Living room now has <strong>' +
          $room.find('.guest-card').length +
          ' guests</strong>).'
      );
    } else if (caseObj.type === 'mutation-remove') {
      $found.addClass('is-found');
      $('#status-result').html(
        'Removed <strong>1 guest</strong>: <strong>Natasha</strong> faded out and left Living room (4 guests remain in Living room).'
      );
    } else {
      const highlightClass = caseObj.type === 'thief' ? 'is-thief' : 'is-found';
      $found.addClass(highlightClass);
      jumpGuests($found);

      const guestNames = $found
        .map(function () {
          return $(this).attr('data-name');
        })
        .get();

      const prefix = caseObj.type === 'thief' ? 'THIEF IDENTIFIED — ' : '';
      $('#status-result').html(
        prefix +
          'Found <strong>' +
          guestNames.length +
          (guestNames.length === 1 ? ' guest' : ' guests') +
          '</strong>: <strong>' +
          guestNames.join(', ') +
          '</strong>'
      );
    }
  }

  /* ------------------------------------------------------------------------
     RENDER THE 20 CASE BUTTONS WITH jQuery
     ------------------------------------------------------------------------ */
  function renderCaseButtons() {
    const $grid = $('#cases-buttons-grid').empty();

    $.each(CASES, function (_, caseObj) {
      const $btn = $('<button type="button" class="btn-case"></button>')
        .attr('id', 'btn-case-' + caseObj.id)
        .attr('data-case-id', caseObj.id);

      if (caseObj.id === 20) {
        $btn.addClass('case-thief');
      }

      $btn.append(
        $('<span class="case-num"></span>').text(caseObj.id),
        $('<span class="case-label"></span>').text(caseObj.title)
      );

      $grid.append($btn);
    });

    // Attach click event with jQuery .on('click')
    $grid.on('click', '.btn-case', function () {
      const caseId = Number($(this).attr('data-case-id'));
      const matchedCase = $.grep(CASES, function (c) {
        return c.id === caseId;
      })[0];
      if (matchedCase) {
        runCase(matchedCase);
      }
    });

    $('#btn-reset-party').on('click', function () {
      $('.btn-case').removeClass('is-active');
      buildPartyPage();
      $('#status-title').text('Select a case below to investigate the party');
      $('#status-result').html('Found: <strong>21 guests</strong> across 4 rooms (initial party state).');
      $('#status-chain').text("$('#party-house .guest-card')");
    });
  }

  // Initialize Task 1
  renderLegendBar();
  buildPartyPage();
  renderCaseButtons();
});

