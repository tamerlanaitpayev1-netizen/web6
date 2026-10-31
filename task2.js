/* ==========================================================================
   ASSIGNMENT #6 — TASK 2: THE PARTY IN MOTION (EFFECTS & ANIMATIONS)
   Student: Aitpayev Tamerlan (IT-2510) | Astana IT University
   Features:
   1. Spotlight: fadeTo(300, 0.2) for non-matching guests; Clear restores 1.0.
   2. Guest Card: Grows out of guest photo with animate(), closes on Esc or
      outside click, shrinks back into photo. Only one open at a time.
   3. Move: Flies guest card across the house via clone() + offset() + animate().
      Old room closes gap slowly; new room opens place slowly; updates array.
   4. Sort by time: Toggles between chronological order and picture order with
      smooth sliding via position() + animate().
   5. Fast clicks: Queue-safe via stop(true, ...) — zero repeating animations.
   ========================================================================== */

$(function () {
  'use strict';

  /* ------------------------------------------------------------------------
     1. INITIAL MASTER DATA & MUTABLE LIVE PARTY ARRAY
     ------------------------------------------------------------------------ */
  const INITIAL_PARTY_DATA = [
    {
      name: 'Balcony',
      slug: 'balcony',
      floor: 2,
      guests: [
        { name: 'Aigerim', color: 'yellow', time: '20:45', aitu: true,  things: ['crumbs', 'bag'], origOrder: 0 },
        { name: 'Aliya',   color: 'green',  time: '21:15', aitu: true,  things: ['phone', 'cup'],  origOrder: 1 },
        { name: 'Madina',  color: 'purple', time: '22:10', aitu: false, things: ['phone', 'bag', 'crumbs'], origOrder: 2 },
        { name: 'Ivan',    color: 'black',  time: '20:10', aitu: false, things: ['bag'], origOrder: 3 }
      ]
    },
    {
      name: 'Hall',
      slug: 'hall',
      floor: 2,
      guests: [
        { name: 'Arman',   color: 'red',    time: '20:35', aitu: false, things: ['bag', 'glasses'], origOrder: 0 },
        { name: 'Sophia',  color: 'yellow', time: '21:30', aitu: false, things: ['phone'], origOrder: 1 },
        { name: 'Dias',    color: 'green',  time: '19:45', aitu: false, things: [], origOrder: 2 },
        { name: 'Bekzat',  color: 'purple', time: '20:55', aitu: true,  things: ['bag', 'cup', 'crumbs'], origOrder: 3 },
        { name: 'Aruzhan', color: 'blue',   time: '21:50', aitu: true,  things: ['phone'], origOrder: 4 },
        { name: 'Saule',   color: 'red',    time: '21:25', aitu: false, things: ['glasses'], origOrder: 5 }
      ]
    },
    {
      name: 'Kitchen',
      slug: 'kitchen',
      floor: 1,
      guests: [
        { name: 'Nurlan',  color: 'red',    time: '19:40', aitu: true,  things: ['phone', 'bag'], origOrder: 0 },
        { name: 'Emma',    color: 'yellow', time: '20:15', aitu: false, things: ['bag'], origOrder: 1 },
        { name: 'Timur',   color: 'green',  time: '21:05', aitu: false, things: ['phone', 'bag', 'crumbs'], origOrder: 2 },
        { name: 'Sergey',  color: 'black',  time: '20:50', aitu: false, things: [], origOrder: 3 },
        { name: 'Yerlan',  color: 'purple', time: '21:40', aitu: false, things: ['glasses', 'phone'], origOrder: 4 },
        { name: 'Kamila',  color: 'blue',   time: '20:05', aitu: false, things: ['bag'], origOrder: 5 }
      ]
    },
    {
      name: 'Living room',
      slug: 'living-room',
      floor: 1,
      guests: [
        { name: 'Daniel',  color: 'blue',   time: '19:55', aitu: true,  things: ['glasses'], origOrder: 0 },
        { name: 'Zarina',  color: 'yellow', time: '21:10', aitu: false, things: ['bag', 'phone', 'crumbs'], origOrder: 1 },
        { name: 'Natasha', color: 'green',  time: '20:30', aitu: false, things: [], origOrder: 2 },
        { name: 'Askar',   color: 'black',  time: '21:00', aitu: true,  things: ['phone'], origOrder: 3 },
        { name: 'Inkar',   color: 'purple', time: '20:20', aitu: false, things: ['bag'], origOrder: 4 }
      ]
    }
  ];

  // Deep clone utility so resets restore the exact initial state
  function clonePartyData(source) {
    return $.map(source, function (room) {
      return {
        name: room.name,
        slug: room.slug,
        floor: room.floor,
        sortedByTime: false,
        guests: $.map(room.guests, function (g) {
          return {
            name: g.name,
            color: g.color,
            time: g.time,
            aitu: g.aitu,
            things: g.things.slice(),
            origOrder: g.origOrder
          };
        })
      };
    });
  }

  let partyState = clonePartyData(INITIAL_PARTY_DATA);
  let nextOrigOrderCounter = 100;

  const ICONS = {
    phone: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="6" y="2" width="12" height="20" rx="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>',
    glasses: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="6" cy="14" r="4"/><circle cx="18" cy="14" r="4"/><path d="M10 14h4"/></svg>',
    bag: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 7h12l1 13H5L6 7z"/><path d="M9 7V5a3 3 0 0 1 6 0v2"/></svg>',
    cup: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 8h1a4 4 0 1 1 0 8h-1"/><path d="M3 8h14v7a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V8z"/></svg>',
    crumbs: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 18h16v-5L12 6 4 13v5z"/><line x1="4" y1="14" x2="20" y2="14"/><circle cx="12" cy="5" r="1.5"/></svg>',
    clock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><polyline points="12 7 12 12 15 15"/></svg>',
    aitu: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 10L12 5 2 10l10 5 10-5z"/><path d="M6 12v5c3 2 9 2 12 0v-5"/></svg>'
  };

  const RING_HEX = {
    blue: '#2563eb',
    purple: '#9333ea',
    green: '#16a34a',
    red: '#dc2626',
    black: '#1e293b',
    yellow: '#eab308'
  };

  /* ------------------------------------------------------------------------
     2. BUILD THE HOUSE & GUEST CARDS FROM partyState
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
        'data-floor': String(floorNum),
        'data-orig-order': String(guest.origOrder !== undefined ? guest.origOrder : 99)
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
    // Cleanup any active flight clones or open popups before rebuilding
    $('.flying-guest-clone').stop(true, true).remove();
    forceHidePopup();

    const $house = $('#party-house').empty();

    $.each([2, 1], function (_, floorNum) {
      const $floorRow = $('<div class="floor-row"></div>')
        .attr('id', 'floor-' + floorNum)
        .attr('data-floor', floorNum);

      const $floorLabel = $('<div class="floor-label-bar"></div>')
        .text('FLOOR ' + floorNum);

      const $roomsGrid = $('<div class="floor-rooms"></div>');

      $.each(partyState, function (_, roomObj) {
        if (roomObj.floor === floorNum) {
          const $room = $('<section class="room"></section>')
            .attr({
              'id': 'room-' + roomObj.slug,
              'data-room': roomObj.slug,
              'data-room-name': roomObj.name,
              'data-floor': floorNum
            });

          const $sortBtn = $('<button type="button" class="btn-sort-room"></button>')
            .attr('data-room', roomObj.slug)
            .toggleClass('is-sorted', Boolean(roomObj.sortedByTime))
            .text('Sort by time');

          const $header = $('<div class="room-header"></div>').append(
            $('<div class="room-title-wrap"></div>').append(
              $('<h2 class="room-name"></h2>').text(roomObj.name),
              $('<span class="room-count-badge"></span>').text(roomObj.guests.length + ' guests')
            ),
            $sortBtn
          );

          const $guestsWrap = $('<div class="room-guests"></div>');

          // Render guests in their current room order (either picture order or sorted order)
          const guestsToRender = roomObj.guests.slice();
          if (roomObj.sortedByTime) {
            guestsToRender.sort(function (a, b) {
              return a.time.localeCompare(b.time);
            });
          }

          $.each(guestsToRender, function (_, guestObj) {
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
    $.each(
      [
        { key: 'phone', label: 'Phone' },
        { key: 'glasses', label: 'Glasses' },
        { key: 'bag', label: 'Bag' },
        { key: 'cup', label: 'Cup' },
        { key: 'crumbs', label: 'Cake crumbs' }
      ],
      function (_, item) {
        $itemsGroup.append(
          $('<span class="legend-item"></span>')
            .append(ICONS[item.key])
            .append($('<span></span>').text(item.label))
        );
      }
    );

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
     3. TASK 2 FEATURE 1: SPOTLIGHT WITH fadeTo(300, 0.2) & CLEAR BUTTON
     "Click a case. The guests that the case finds stay bright. All other
      guests become pale: they fade to 20% in 0.3 seconds. Some cases find
      rooms, not guests. For these cases, the guests in all the other rooms
      become pale. The Clear button makes all guests bright again."
     ------------------------------------------------------------------------ */
  const CASES = [
    {
      id: 1,
      title: 'Who is in the hall?',
      type: 'guests',
      chainText: "$('#room-hall .guest-card')",
      execute: function () { return $('#room-hall .guest-card'); }
    },
    {
      id: 2,
      title: 'Who is dressed in yellow or purple?',
      type: 'guests',
      chainText: "$('.guest-card.color-yellow, .guest-card.color-purple')",
      execute: function () { return $('.guest-card.color-yellow, .guest-card.color-purple'); }
    },
    {
      id: 3,
      title: 'Which AITU students are upstairs?',
      type: 'guests',
      chainText: "$('#floor-2 .guest-card.is-aitu')",
      execute: function () { return $('#floor-2 .guest-card.is-aitu'); }
    },
    {
      id: 4,
      title: 'Who has glasses or a bag?',
      type: 'guests',
      chainText: "$('.guest-card:has(.thing-glasses, .thing-bag)')",
      execute: function () { return $('.guest-card:has(.thing-glasses, .thing-bag)'); }
    },
    {
      id: 5,
      title: 'Who came with nothing at all?',
      type: 'guests',
      chainText: "$('.guest-card:not(:has(.thing-icon))')",
      execute: function () { return $('.guest-card:not(:has(.thing-icon))'); }
    },
    {
      id: 6,
      title: 'Who has a phone but no bag?',
      type: 'guests',
      chainText: "$('.guest-card:has(.thing-phone):not(:has(.thing-bag))')",
      execute: function () { return $('.guest-card:has(.thing-phone):not(:has(.thing-bag))'); }
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
      execute: function () { return $('.room .guest-card:last-child'); }
    },
    {
      id: 11,
      title: 'Who stands third in each room?',
      type: 'guests',
      chainText: "$('.room .guest-card:nth-child(3)')",
      execute: function () { return $('.room .guest-card:nth-child(3)'); }
    },
    {
      id: 12,
      title: 'Who stands after Timur in his room?',
      type: 'guests',
      chainText: "$('.guest-card[data-name=\"Timur\"]').nextAll()",
      execute: function () { return $('.guest-card[data-name="Timur"]').nextAll(); }
    },
    {
      id: 13,
      title: 'Who stands right before someone in black?',
      type: 'guests',
      chainText: "$('.guest-card.color-black').prev()",
      execute: function () { return $('.guest-card.color-black').prev(); }
    },
    {
      id: 14,
      title: 'In which room is Aruzhan?',
      type: 'rooms',
      chainText: "$('.guest-card[data-name=\"Aruzhan\"]').closest('.room')",
      execute: function () { return $('.guest-card[data-name="Aruzhan"]').closest('.room'); }
    },
    {
      id: 15,
      title: 'Which rooms have fewer than 6 guests?',
      type: 'rooms',
      chainText: "$('.room:not(:has(.guest-card:nth-child(6)))')",
      execute: function () { return $('.room:not(:has(.guest-card:nth-child(6)))'); }
    },
    {
      id: 16,
      title: 'In which rooms does somebody have a cup, but nobody wears glasses?',
      type: 'rooms',
      chainText: "$('.room:has(.thing-cup):not(:has(.thing-glasses))')",
      execute: function () { return $('.room:has(.thing-cup):not(:has(.thing-glasses))'); }
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
          { name: 'Miras', color: 'blue', time: '21:20', aitu: true, things: ['phone'], origOrder: 98 },
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

  function jumpGuests($guests) {
    $guests
      .stop(true, true)
      .css('top', '0px')
      .animate({ top: '-15px' }, 150)
      .animate({ top: '0px' }, 170);
  }

  function applySpotlight($brightGuests) {
    const $allGuests = $('#party-house .guest-card');
    const $paleGuests = $allGuests.not($brightGuests);

    // Stop any queued opacity animations immediately so fast clicks never queue up
    $brightGuests.stop(true, false).fadeTo(300, 1);
    $paleGuests.stop(true, false).fadeTo(300, 0.2);
  }

  function clearSpotlight() {
    $('.btn-case').removeClass('is-active');
    $('.room').removeClass('is-found-room');
    $('#party-house .guest-card')
      .removeClass('is-found is-thief')
      .stop(true, false)
      .css('top', '0px')
      .fadeTo(300, 1);

    $('#status-title').text('Spotlight Cleared — All Guests Bright');
    $('#status-result').html('All <strong>' + $('#party-house .guest-card').length + ' guests</strong> restored to 100% brightness.');
    $('#status-chain').text("$('#party-house .guest-card').stop(true, false).fadeTo(300, 1)");
  }

  function runCaseSpotlight(caseObj) {
    // Rebuild from live partyState (which preserves moves from Task 2.3!)
    buildPartyPage();

    $('.btn-case').removeClass('is-active');
    $('#btn-case-' + caseObj.id).addClass('is-active');

    $('#status-title').text('Case #' + caseObj.id + ': ' + caseObj.title);
    $('#status-chain').text(caseObj.chainText);

    const $found = caseObj.execute();

    if (caseObj.type === 'rooms') {
      $found.addClass('is-found-room');
      const $brightGuests = $found.find('.guest-card').addClass('is-found');
      applySpotlight($brightGuests);
      jumpGuests($brightGuests);

      const roomNames = $found.map(function () { return $(this).attr('data-room-name'); }).get();
      $('#status-result').html(
        'Spotlighted <strong>' + roomNames.length + (roomNames.length === 1 ? ' room' : ' rooms') +
        '</strong>: <strong>' + roomNames.join(', ') + '</strong> (' + $brightGuests.length + ' guests bright, other rooms faded to 20%).'
      );
    } else if (caseObj.type === 'mutation-add') {
      $found.addClass('is-found');
      applySpotlight($found);
      jumpGuests($found);
      const $room = $found.closest('.room');
      $room.find('.room-count-badge').text($room.find('.guest-card').length + ' guests');
      $('#status-result').html('Added &amp; spotlighted <strong>Miras</strong> in Living room; all other guests faded to 20%.');
    } else if (caseObj.type === 'mutation-remove') {
      $('#party-house .guest-card').not($found).stop(true, false).fadeTo(300, 1);
      $('#status-result').html('<strong>Natasha</strong> faded out and left the party.');
    } else {
      const highlightClass = caseObj.type === 'thief' ? 'is-thief' : 'is-found';
      $found.addClass(highlightClass);
      applySpotlight($found);
      jumpGuests($found);

      const names = $found.map(function () { return $(this).attr('data-name'); }).get();
      $('#status-result').html(
        'Spotlighted <strong>' + names.length + (names.length === 1 ? ' guest' : ' guests') +
        '</strong>: <strong>' + (names.join(', ') || 'None') + '</strong> (others faded to 20% in 0.3s).'
      );
    }
  }

  /* ------------------------------------------------------------------------
     4. TASK 2 FEATURE 2: MORPHING GUEST CARD POPUP
     "Click a guest. A card with all the information about this guest opens.
      The card shows the information in words, for example 'Came at 20:30',
      'AITU student', 'Has a phone and a bag'. The card does not just appear:
      it starts small on the guest's photo and grows to its full size.
      The card closes when the user presses Esc or clicks outside the card.
      Then it gets small again and goes back into the photo. Only one card
      can be open. When the user clicks another guest, the first card closes
      and the new one opens."
     ------------------------------------------------------------------------ */
  let activePopupGuestName = null;
  let $activeTriggerCard = null;
  const POPUP_WIDTH = 285;
  const POPUP_HEIGHT = 310;

  function formatThingsInWords(thingsArray) {
    if (!thingsArray || thingsArray.length === 0) {
      return 'Came with nothing at all';
    }
    const labels = $.map(thingsArray, function (item) {
      if (item === 'phone') return 'a phone';
      if (item === 'bag') return 'a bag';
      if (item === 'cup') return 'a cup';
      if (item === 'glasses') return 'glasses';
      if (item === 'crumbs') return 'cake crumbs';
      return item;
    });
    if (labels.length === 1) {
      return 'Has ' + labels[0];
    }
    if (labels.length === 2) {
      return 'Has ' + labels[0] + ' and ' + labels[1];
    }
    return 'Has ' + labels.slice(0, -1).join(', ') + ', and ' + labels[labels.length - 1];
  }

  function capitalizeWord(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  function getAvatarBoxRect($guestCard) {
    const $ring = $guestCard.find('.avatar-ring');
    const offset = $ring.offset() || $guestCard.offset() || { top: 200, left: 200 };
    return {
      top: offset.top,
      left: offset.left,
      width: $ring.outerWidth() || 54,
      height: $ring.outerHeight() || 54
    };
  }

  function forceHidePopup() {
    const $popup = $('#guest-popup-card');
    $popup.stop(true, false).hide().empty();
    activePopupGuestName = null;
    $activeTriggerCard = null;
  }

  function closeGuestPopup(onClosedCallback) {
    const $popup = $('#guest-popup-card');
    if (!activePopupGuestName || !$popup.is(':visible')) {
      forceHidePopup();
      if (typeof onClosedCallback === 'function') onClosedCallback();
      return;
    }

    const $targetCard = $activeTriggerCard && $activeTriggerCard.closest('body').length
      ? $activeTriggerCard
      : $('.guest-card[data-name="' + activePopupGuestName + '"]');

    if (!$targetCard.length) {
      forceHidePopup();
      if (typeof onClosedCallback === 'function') onClosedCallback();
      return;
    }

    const rect = getAvatarBoxRect($targetCard);
    const closingName = activePopupGuestName;
    activePopupGuestName = null;
    $activeTriggerCard = null;

    $popup.find('.popup-inner').stop(true, false).fadeOut(90);
    $popup
      .stop(true, false)
      .animate(
        {
          top: rect.top,
          left: rect.left,
          width: rect.width,
          height: rect.height,
          opacity: 0.15
        },
        220,
        function () {
          $popup.hide().empty();
          if (typeof onClosedCallback === 'function') {
            onClosedCallback(closingName);
          }
        }
      );
  }

  function openGuestPopup($guestCard) {
    const guestName = $guestCard.attr('data-name');
    if (!guestName) return;

    // If clicking the exact same guest whose card is already open, shrink it back
    if (activePopupGuestName === guestName) {
      closeGuestPopup();
      return;
    }

    // If another guest's card is open, close it first, then open the new one
    if (activePopupGuestName && activePopupGuestName !== guestName) {
      closeGuestPopup(function () {
        openGuestPopupImmediate($guestCard);
      });
      return;
    }

    openGuestPopupImmediate($guestCard);
  }

  function openGuestPopupImmediate($guestCard) {
    const guestName = $guestCard.attr('data-name');
    const color = $guestCard.attr('data-color');
    const time = $guestCard.attr('data-time');
    const isAitu = $guestCard.attr('data-aitu') === 'true';
    const rawThings = $guestCard.attr('data-things');
    const things = rawThings ? rawThings.split(',') : [];
    const currentRoomSlug = $guestCard.attr('data-room');
    const currentRoomName = $guestCard.closest('.room').attr('data-room-name') || currentRoomSlug;

    activePopupGuestName = guestName;
    $activeTriggerCard = $guestCard;

    const avatarUrl = 'https://api.dicebear.com/9.x/open-peeps/svg?seed=' + encodeURIComponent(guestName);
    const $popup = $('#guest-popup-card').stop(true, false).empty();

    const $inner = $('<div class="popup-inner"></div>');

    // Header
    const $header = $('<div class="popup-header"></div>').append(
      $('<div class="popup-avatar-ring"></div>')
        .css('border-color', RING_HEX[color] || '#1e293b')
        .append($('<img alt="">').attr('src', avatarUrl).attr('alt', guestName)),
      $('<div class="popup-title-area"></div>').append(
        $('<div class="popup-name"></div>').text(guestName),
        $('<div class="popup-room-tag"></div>').text('In the ' + currentRoomName)
      ),
      $('<button type="button" class="btn-close-popup" title="Close (Esc)">×</button>')
    );

    // Words List
    const $list = $('<ul class="popup-details-list"></ul>').append(
      $('<li></li>').text('Came at ' + time),
      $('<li></li>').text(isAitu ? 'AITU student' : 'Not an AITU student'),
      $('<li></li>').text('Dressed in ' + color),
      $('<li></li>').text(formatThingsInWords(things))
    );

    // Move buttons for each other room
    const $movesTitle = $('<div class="popup-moves-title">Move to another room</div>');
    const $movesWrap = $('<div class="popup-move-buttons"></div>');

    $.each(partyState, function (_, roomObj) {
      if (roomObj.slug !== currentRoomSlug) {
        const $moveBtn = $('<button type="button" class="btn-move-room"></button>')
          .attr('data-guest-name', guestName)
          .attr('data-target-room', roomObj.slug)
          .text('Move to the ' + roomObj.name.toLowerCase());
        $movesWrap.append($moveBtn);
      }
    });

    $inner.append($header, $list, $movesTitle, $movesWrap).hide();
    $popup.append($inner);

    // Start small on the guest's photo
    const startRect = getAvatarBoxRect($guestCard);
    const docWidth = $(window).width() || 1200;

    let targetLeft = startRect.left + startRect.width / 2 - POPUP_WIDTH / 2;
    if (targetLeft < 16) targetLeft = 16;
    if (targetLeft + POPUP_WIDTH > docWidth - 16) {
      targetLeft = docWidth - POPUP_WIDTH - 16;
    }

    let targetTop = startRect.top - 20;
    if (targetTop < 70) targetTop = 70;

    $popup
      .css({
        display: 'block',
        top: startRect.top,
        left: startRect.left,
        width: startRect.width,
        height: startRect.height,
        opacity: 0.25
      })
      .animate(
        {
          top: targetTop,
          left: targetLeft,
          width: POPUP_WIDTH,
          height: POPUP_HEIGHT,
          opacity: 1
        },
        240,
        function () {
          $popup.css('height', 'auto');
          $inner.fadeIn(120);
        }
      );
  }

  /* ------------------------------------------------------------------------
     5. TASK 2 FEATURE 3: MOVE GUEST ACROSS HOUSE WITH FLIGHT & GAP ANIMATION
     "The guest card has a button for each other room, for example 'Move to
      the hall'. Click a button to send the guest to the end of that room.
      The guest's card flies across the house to the new room; it does not
      jump. In the old room, the empty place closes slowly. In the new room,
      a place opens slowly. After the move, change your array too, so that
      the cases from Task 1 find the guest in the new room."
     ------------------------------------------------------------------------ */
  function moveGuestToRoom(guestName, targetRoomSlug) {
    const $sourceCard = $('#party-house .guest-card[data-name="' + guestName + '"]');
    const $targetRoom = $('#room-' + targetRoomSlug);
    if (!$sourceCard.length || !$targetRoom.length) return;

    const sourceRoomSlug = $sourceCard.attr('data-room');
    if (sourceRoomSlug === targetRoomSlug) return;

    // Immediately close the popup card
    forceHidePopup();

    // Finish any in-progress flight animations cleanly before starting a new move
    $('.flying-guest-clone, .guest-slot-spacer').stop(true, true);

    // 1. Update partyState array immediately so data is always consistent
    let movedGuestData = null;
    let targetRoomData = null;

    $.each(partyState, function (_, roomObj) {
      if (roomObj.slug === sourceRoomSlug) {
        const idx = $.map(roomObj.guests, function (g) { return g.name; }).indexOf(guestName);
        if (idx !== -1) {
          movedGuestData = roomObj.guests.splice(idx, 1)[0];
        }
      }
      if (roomObj.slug === targetRoomSlug) {
        targetRoomData = roomObj;
      }
    });

    if (!movedGuestData || !targetRoomData) return;

    movedGuestData.origOrder = ++nextOrigOrderCounter;
    // Moving a guest to the end of the target room puts that room in custom end-order
    targetRoomData.sortedByTime = false;
    targetRoomData.guests.push(movedGuestData);

    const $sourceRoom = $('#room-' + sourceRoomSlug);
    const $targetGuestsWrap = $targetRoom.find('.room-guests');
    const cardWidth = $sourceCard.outerWidth() || 82;
    const startOffset = $sourceCard.offset();

    // 2. Create a placeholder spacer in the target room that opens slowly (0 -> cardWidth)
    const $openSpacer = $('<div class="guest-slot-spacer"></div>')
      .css({ width: 0, height: $sourceCard.outerHeight() || 148 })
      .appendTo($targetGuestsWrap);

    // Prepare the actual destination card (hidden until flight lands)
    const $newCard = createGuestCardElement(movedGuestData, targetRoomData.slug, targetRoomData.floor)
      .css({ display: 'none' })
      .appendTo($targetGuestsWrap);

    // Calculate where the landing spot at the end of the target room is
    const spacerOffset = $openSpacer.offset();
    const targetLeft = spacerOffset ? spacerOffset.left : ($targetGuestsWrap.offset().left + 20);
    const targetTop = spacerOffset ? spacerOffset.top : $targetGuestsWrap.offset().top;

    // 3. Create the flying clone on body at the exact start offset
    const $flyingClone = $sourceCard
      .clone()
      .addClass('flying-guest-clone')
      .css({
        position: 'absolute',
        top: startOffset.top,
        left: startOffset.left,
        width: cardWidth,
        margin: 0,
        zIndex: 950,
        boxShadow: '0 14px 28px rgba(15, 44, 76, 0.25)'
      })
      .appendTo('body');

    // 4. Replace source card with a closing spacer that shrinks slowly (cardWidth -> 0)
    const $closeSpacer = $('<div class="guest-slot-spacer"></div>')
      .css({ width: cardWidth, height: $sourceCard.outerHeight() || 148 });
    $sourceCard.replaceWith($closeSpacer);

    $closeSpacer.animate({ width: 0 }, 420, function () {
      $(this).remove();
    });

    // 5. Open the space in the new room slowly (0 -> cardWidth)
    $openSpacer.animate({ width: cardWidth }, 420);

    // Update room badges & sort state UI
    $sourceRoom.find('.room-count-badge').text(
      ($.grep(partyState, function (r) { return r.slug === sourceRoomSlug; })[0].guests.length) + ' guests'
    );
    $targetRoom.find('.room-count-badge').text(targetRoomData.guests.length + ' guests');
    $targetRoom.find('.btn-sort-room').removeClass('is-sorted');

    // 6. Fly the guest card smoothly across the house to the new room
    $flyingClone.animate(
      {
        top: targetTop,
        left: targetLeft
      },
      440,
      function () {
        $openSpacer.remove();
        $flyingClone.remove();
        $newCard.css({ display: 'flex', opacity: 1 });

        $('#status-title').text('Moved ' + guestName + ' to the ' + targetRoomData.name);
        $('#status-result').html(
          '<strong>' + guestName + '</strong> flew to the end of <strong>' + targetRoomData.name +
          '</strong>. The party array is updated for all Task 1 cases.'
        );
        $('#status-chain').text(
          "$clone.css(startOffset).appendTo('body').animate(targetOffset, 440)"
        );
      }
    );
  }

  /* ------------------------------------------------------------------------
     6. TASK 2 FEATURE 4 & 5: SORT BY TIME (SLIDING CARDS & FAST-CLICK SAFE)
     "Each room has a button 'Sort by time'. Click it, and the guests of this
      room stand in order of their arrival time, from the earliest to the
      latest. Click it again, and the guests go back to the order in the
      picture. The cards move slowly to their new places; they do not jump.
      Fast clicks: Click the buttons and guests very fast, many times. Every
      effect must still end in the right state. No animation repeats again
      and again after the user stops clicking."
     ------------------------------------------------------------------------ */
  function toggleSortRoomByTime(roomSlug) {
    forceHidePopup();

    const roomData = $.grep(partyState, function (r) {
      return r.slug === roomSlug;
    })[0];
    if (!roomData) return;

    const $room = $('#room-' + roomSlug);
    const $container = $room.find('.room-guests');
    const $cards = $container.children('.guest-card');
    if ($cards.length <= 1) return;

    // 1. Toggle target state immediately (so 5 fast clicks flip boolean 5 times -> sorted!)
    roomData.sortedByTime = !roomData.sortedByTime;
    const isNowSorted = roomData.sortedByTime;
    $room.find('.btn-sort-room').toggleClass('is-sorted', isNowSorted);

    // 2. Stop any ongoing card slide animations in this room immediately (no queue buildup!)
    // Before stopping, capture each card's current visual position relative to the container
    const currentPositions = {};
    $cards.each(function () {
      const $c = $(this);
      const name = $c.attr('data-name');
      const pos = $c.position();
      const leftOffset = parseFloat($c.css('left')) || 0;
      currentPositions[name] = {
        visualLeft: pos.left,
        cssLeft: leftOffset
      };
      // Stop animation without jumping to old target so we can smoothly glide from current visual spot
      $c.stop(true, false);
    });

    // Reset inline left/top to 0 before reordering DOM so we can measure clean natural layout slots
    $cards.css({ left: '0px', top: '0px' });

    // 3. Determine the desired order of DOM elements
    const sortedCardElements = $cards.get().sort(function (a, b) {
      if (isNowSorted) {
        const timeA = $(a).attr('data-time');
        const timeB = $(b).attr('data-time');
        return timeA.localeCompare(timeB);
      } else {
        const orderA = Number($(a).attr('data-orig-order'));
        const orderB = Number($(b).attr('data-orig-order'));
        return orderA - orderB;
      }
    });

    // 4. Re-append cards in the new target DOM order
    $.each(sortedCardElements, function (_, el) {
      $container.append(el);
    });

    // 5. Measure new natural slot positions and animate from old visual position -> 0
    $container.children('.guest-card').each(function () {
      const $c = $(this);
      const name = $c.attr('data-name');
      const newNaturalLeft = $c.position().left;
      const oldVisualLeft = currentPositions[name] ? currentPositions[name].visualLeft : newNaturalLeft;
      const deltaX = oldVisualLeft - newNaturalLeft;

      $c.css({ position: 'relative', left: deltaX + 'px', top: '0px' })
        .stop(true, false)
        .animate({ left: '0px' }, 360);
    });

    // Update status bar with current room order
    const orderedTimes = $.map(sortedCardElements, function (el) {
      return $(el).attr('data-name') + ' (' + $(el).attr('data-time') + ')';
    });

    $('#status-title').text(
      roomData.name + ': ' + (isNowSorted ? 'Sorted by Arrival Time (Earliest → Latest)' : 'Restored to Original Picture Order')
    );
    $('#status-result').html(
      'Order in <strong>' + roomData.name + '</strong>: <strong>' + orderedTimes.join(' → ') + '</strong>'
    );
    $('#status-chain').text(
      "$cards.stop(true, false).css({ left: deltaX }).animate({ left: 0 }, 360)"
    );
  }

  /* ------------------------------------------------------------------------
     7. RENDER CASE BUTTONS & ATTACH jQUERY EVENT LISTENERS (.on)
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
  }

  function bindEvents() {
    // 1. Click a Case Button -> Spotlight
    $('#cases-buttons-grid').on('click', '.btn-case', function () {
      const caseId = Number($(this).attr('data-case-id'));
      const matchedCase = $.grep(CASES, function (c) { return c.id === caseId; })[0];
      if (matchedCase) {
        runCaseSpotlight(matchedCase);
      }
    });

    // 2. Click Clear Button -> Restore all guests to 100% brightness
    $('#btn-clear-spotlight').on('click', function () {
      clearSpotlight();
    });

    // 3. Click Reset Original House Button
    $('#btn-reset-party').on('click', function () {
      partyState = clonePartyData(INITIAL_PARTY_DATA);
      $('.btn-case').removeClass('is-active');
      buildPartyPage();
      $('#status-title').text('House Reset to Initial Picture State');
      $('#status-result').html('All <strong>21 guests</strong> restored to their original rooms and picture order.');
      $('#status-chain').text('buildPartyPage()');
    });

    // 4. Click a Guest Card -> Open/Morph Guest Inspector Card
    $('#party-house').on('click', '.guest-card', function (e) {
      e.stopPropagation();
      openGuestPopup($(this));
    });

    // 5. Click "Sort by time" inside a room
    $('#party-house').on('click', '.btn-sort-room', function (e) {
      e.stopPropagation();
      const roomSlug = $(this).attr('data-room');
      toggleSortRoomByTime(roomSlug);
    });

    // 6. Inside Guest Popup: Close button or Move to room button
    $('#guest-popup-card').on('click', function (e) {
      e.stopPropagation();
    });

    $('#guest-popup-card').on('click', '.btn-close-popup', function (e) {
      e.stopPropagation();
      closeGuestPopup();
    });

    $('#guest-popup-card').on('click', '.btn-move-room', function (e) {
      e.stopPropagation();
      const guestName = $(this).attr('data-guest-name');
      const targetRoom = $(this).attr('data-target-room');
      moveGuestToRoom(guestName, targetRoom);
    });

    // 7. Click outside the Guest Popup Card closes it
    $(document).on('click', function (e) {
      if (activePopupGuestName && !$(e.target).closest('#guest-popup-card, .guest-card').length) {
        closeGuestPopup();
      }
    });

    // 8. Press Esc key closes the Guest Popup Card
    $(document).on('keydown', function (e) {
      if (e.key === 'Escape' || e.keyCode === 27) {
        if (activePopupGuestName) {
          closeGuestPopup();
        }
      }
    });
  }

  // Initialize Task 2
  renderLegendBar();
  buildPartyPage();
  renderCaseButtons();
  bindEvents();
});

