// src/screens/HomeScreen.js
import React, { useMemo, useState } from 'react';
import { ScrollView, View, Text, StyleSheet, TouchableOpacity, useWindowDimensions } from 'react-native';
import { useApp } from '../context/AppContext';
import { Card, PlaceholderBlock } from '../components/UI';
import { COLORS } from '../theme';
import DateIndicator from '../components/DateIndicator';

// Category palette for Budget Overview
const CAT_COLORS = {
  Food: COLORS.yellow,
  Transport: COLORS.steelBlue,
  Entertainment: COLORS.green,
  Bills: '#9CA3AF',
  Health: COLORS.red,
};


export default function HomeScreen() {
  const { records, settings } = useApp();
  const { width } = useWindowDimensions();

  // Header / headline (matches mock; wire up to real data later if you want)
  const [monthLabel] = useState('October 2025');
  const { incomeHeadline, expenseHeadline } = useMemo(
    () => ({ incomeHeadline: 1000, expenseHeadline: 484 }),
    [records]
  );

  // This Month's Activity (Income / Expense per week)
  const weeks = [
    { label: 'Week 1', income: 720,  expense: 140 },
    { label: 'Week 2', income: 900,  expense: 170 },
    { label: 'Week 3', income: 780,  expense: 160 },
    { label: 'Week 4', income: 1150, expense: 220 },
  ];

  // Toggle state (can be: income only, expense only, both) — never zero.
  const [incomeOn, setIncomeOn] = useState(true);
  const [expenseOn, setExpenseOn] = useState(true);

  const toggleIncome = () => {
    if (incomeOn && !expenseOn) { setIncomeOn(false); setExpenseOn(true); }  // prevent zero
    else setIncomeOn(!incomeOn);
  };
  const toggleExpense = () => {
    if (expenseOn && !incomeOn) { setExpenseOn(false); setIncomeOn(true); }  // prevent zero
    else setExpenseOn(!expenseOn);
  };

  // Visible Y max based on which series are active
  const visibleMax = useMemo(() => {
    let m = 0;
    if (incomeOn)  m = Math.max(m, ...weeks.map(w => w.income));
    if (expenseOn) m = Math.max(m, ...weeks.map(w => w.expense));
    const step = 30; // round nicely
    return Math.max(step, Math.ceil(m / step) * step);
  }, [weeks, incomeOn, expenseOn]);

  // Build ticks 0..max (5 labels like your mock)
  const yTicks = useMemo(() => {
    const steps = 4; // 0, 1/4, 1/2, 3/4, max
    const s = visibleMax / steps;
    return new Array(steps + 1).fill(0).map((_, i) => Math.round(i * s));
  }, [visibleMax]);

  // Savings/Remaining (visual)
  const savings   = 3250;
  const remaining = 1890;

  // Responsive sizing for Activity chart (+ horizontal scroll when needed)
const chartHeight = 170;
const innerPadH   = 8;
const colCount    = weeks.length;

// viewport width available for the chart area (minus page padding & y-axis)
const innerWidth  = Math.max(260, width - 16 * 2 - 48);

// ensure each column has a minimum width; if total exceeds innerWidth, we enable horizontal scroll
const minColSpace = 72;
const colSpace    = Math.max(innerWidth / colCount, minColSpace);
const contentWidth = colSpace * colCount; // actual drawable width (may be > innerWidth)

const bothShown   = incomeOn && expenseOn;
const singleBarW  = Math.min(42, Math.max(26, colSpace * 0.42));
const dualBarW    = Math.min(32, Math.max(18, colSpace * 0.32));
const dualGap     = bothShown ? Math.max(6, colSpace * 0.08) : 0;

// keep some visual headroom at the top, but anchor bars to the real bottom (₱0)
const topPad = 12;
const toHeight = (v) => (v / visibleMax) * (chartHeight - topPad);

  // Budget Overview data + toggle
  const [budgetChartMode, setBudgetChartMode] = useState('donut'); // 'donut' | 'bar'
  const budgetData = [
    { label: 'Food',         value: 35, color: CAT_COLORS.Food },
    { label: 'Transport',    value: 20, color: CAT_COLORS.Transport },
    { label: 'Entertainment',value: 15, color: CAT_COLORS.Entertainment },
    { label: 'Bills',        value: 20, color: CAT_COLORS.Bills },
    { label: 'Health',       value: 10, color: CAT_COLORS.Health },
  ];

  // Weekly Spending Trend (₱70–₱350 axis)
  const trendPoints = [210, 260, 230, 300];

  return (
    <ScrollView
      style={{ flex: 1 }}
      contentContainerStyle={{ paddingBottom: 160 }}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
    <DateIndicator
      title={monthLabel}
      expense={expenseHeadline}
      income={incomeHeadline}
      currency={settings.currency}
      onMenuPress={() => {}}
      onPrevPress={() => {}}
      onNextPress={() => {}}
      onRefreshPress={() => {}}
    />

      {/* Tip Banner (keep) */}
      <View style={styles.tipBanner}>
        <Text style={styles.tipEmoji}>💡</Text>
        <Text style={styles.tipText}>
          You spend 20% more on weekends. Consider setting weekend spending limits to stay on track.
        </Text>
      </View>

      {/* Savings / Remaining (keep) */}
      <View style={styles.duo}>
        <View style={[styles.statCard, { backgroundColor: COLORS.steelBlue }]}>
          <Text style={styles.statHdr}>CURRENT SAVINGS</Text>
          <Text style={styles.statVal}>{settings.currency}{savings.toLocaleString()}</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: COLORS.green }]}>
          <Text style={styles.statHdr}>REMAINING BALANCE</Text>
          <Text style={styles.statVal}>{settings.currency}{remaining.toLocaleString()}</Text>
        </View>
      </View>

      {/* ===================== This Month's Activity (fixed) ===================== */}
      <Card style={styles.cardOuter}>
        <Text style={styles.sectionTitle}>This Month&apos;s Activity</Text>

        <View style={styles.activityChart}>
          {/* Y-axis labels (top -> bottom) */}
          <View style={styles.yAxisLeft}>
            {[...yTicks].reverse().map((val, idx) => (
              <Text key={idx} style={styles.yLeftTxt}>{settings.currency}{val}</Text>
            ))}
          </View>

            {/* Grid and Bars (horizontally scrollable when needed) */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ width: contentWidth }}
          >
            <View style={[styles.activityGrid, { height: chartHeight, width: contentWidth }]}>
              {/* grid lines */}
              {yTicks.map((_, i) => {
              const frac = i / yTicks.length;
              const y = topPad + frac * (chartHeight - topPad);
              return (
                <View
                  key={i}
                  style={[
                    styles.hLine,
                    { top: y, opacity: i === 0 ? 0 : 1 },
                  ]}
                />
              );
            })}

            {/* explicit baseline at ₱0 so bars clearly start from zero */}
            <View style={[styles.hLineZero, { top: topPad + (chartHeight - topPad) }]} />

              {/* bars anchored to 0 baseline at bottom */}
              <View style={[styles.barsRow, { paddingHorizontal: innerPadH, top: topPad, bottom: -20 }]}>
                {weeks.map((w, idx) => (
                  <View key={idx} style={[styles.barGroup, { width: colSpace }]}>
                    {bothShown ? (
                      <View style={[styles.dualRow, { gap: dualGap }]}>
                        {expenseOn && (
                          <View style={[
                            styles.bar,
                            { width: dualBarW, height: Math.max(4, toHeight(w.expense)), backgroundColor: COLORS.red }
                          ]} />
                        )}
                        {incomeOn && (
                          <View style={[
                            styles.bar,
                            { width: dualBarW, height: Math.max(4, toHeight(w.income)), backgroundColor: COLORS.green }
                          ]} />
                        )}
                      </View>
                    ) : incomeOn ? (
                      <View style={[
                        styles.bar,
                        { width: singleBarW, height: Math.max(4, toHeight(w.income)), backgroundColor: COLORS.green }
                      ]} />
                    ) : (
                      <View style={[
                        styles.bar,
                        { width: singleBarW, height: Math.max(4, toHeight(w.expense)), backgroundColor: COLORS.red }
                      ]} />
                    )}
                    <Text style={styles.weekLbl}>{w.label}</Text>
                  </View>
                ))}
              </View>
            </View>
          </ScrollView>

        </View>

        {/* Toggle buttons (one, the other, or both — never zero) */}
        <View style={styles.pillRow}>
          <TouchableOpacity
            onPress={toggleExpense}
            style={[styles.pill, expenseOn ? styles.pillActiveRed : styles.pillNeutral]}
            activeOpacity={0.9}
          >
            <Text style={[styles.pillTxt, expenseOn && styles.pillTxtActive]}>Expenses</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={toggleIncome}
            style={[styles.pill, incomeOn ? styles.pillActiveGreen : styles.pillNeutral]}
            activeOpacity={0.9}
          >
            <Text style={[styles.pillTxt, incomeOn && styles.pillTxtActive]}>Income</Text>
          </TouchableOpacity>
        </View>
      </Card>

      {/* ===================== Budget Overview (Donut / Bar) ===================== */}
      <Card style={styles.cardOuter}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>Budget Overview</Text>
          <View style={styles.switchWrap}>
            <TouchableOpacity
              onPress={() => setBudgetChartMode('donut')}
              style={[styles.switchBtn, budgetChartMode === 'donut' && styles.switchActive]}
            >
              <Text style={[styles.switchTxt, budgetChartMode === 'donut' && styles.switchTxtActive]}>Donut</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setBudgetChartMode('bar')}
              style={[styles.switchBtn, budgetChartMode === 'bar' && styles.switchActive]}
            >
              <Text style={[styles.switchTxt, budgetChartMode === 'bar' && styles.switchTxtActive]}>Bar</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.budgetWrap}>
          {budgetChartMode === 'donut' ? <DonutChart data={budgetData} /> : <BudgetBars data={budgetData} />}
          <View style={{ flex: 1, paddingLeft: 12 }}>
            {budgetData.map((d) => (
              <View key={d.label} style={styles.legendRow}>
                <View style={[styles.legendDot, { backgroundColor: d.color }]} />
                <Text style={styles.legendLabel}>
                  {d.label}  <Text style={styles.legendPct}>{d.value}%</Text>
                </Text>
              </View>
            ))}
          </View>
        </View>
      </Card>

      {/* ===================== Weekly Spending Trend ===================== */}
      <Card style={styles.cardOuter}>
        <View style={styles.blueLabel}>
          <Text style={styles.blueLabelTxt}>Weekly Spending Trend</Text>
        </View>
        <TrendChart points={trendPoints} />
      </Card>

      <PlaceholderBlock height={28} style={{ backgroundColor: 'transparent' }} />
    </ScrollView>
  );
}

/* ---------------- Donut & Bars for Budget Overview (no libs) ---------------- */

// Donut with proportional arcs + tiny separators (keeps Bar switch untouched)
function DonutChart({ data }) {
  const size = 140;
  const thickness = 28;
  const radius = size / 2;

  // Use the full 360° (no visible gaps) and a tiny negative gap (overlap) to hide seams
const OVERLAP_DEG = 0.6;      // small overlap so borders meet cleanly
const MAX_SPAN = 179.9;
const total = Math.max(1, data.reduce((a, d) => a + d.value, 0));

let start = -90; // 12 o’clock
const pieces = [];

// angles strictly proportional and sum to 360
let angles = data.map(d => (d.value / total) * 360);
const drift = 360 - angles.reduce((a, x) => a + x, 0);
if (angles.length) angles[angles.length - 1] += drift; // absorb float drift

data.forEach(({ color }, i) => {
  let arc = angles[i];
  while (arc > 0.01) {
    const span = Math.min(arc, MAX_SPAN);
    pieces.push({ start, span, color });
    // subtract a tiny amount so the next slice overlaps this one a hair
    start += span - OVERLAP_DEG;
    arc   -= span;
  }
});


  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      {/* light base ring under the gaps */}
      <View
        style={{
          position: 'absolute',
          width: size,
          height: size,
          borderRadius: radius,
          borderWidth: thickness,
          borderColor: COLORS.grayLight,
        }}
      />

      {/* proportional colored arcs */}
      {pieces.map((p, i) => (
  <View
    key={i}
    style={{
      position: 'absolute',
      width: size,
      height: size,
      borderRadius: radius,
      borderWidth: thickness,
      borderColor: 'transparent',
      borderTopColor: p.color,
      transform: [{ rotate: `${p.start}deg` }, { translateY: -thickness / 2 }],
    }}
  >
    <View
      style={{
        position: 'absolute',
        width: size,
        height: size,
        borderRadius: radius,
        borderWidth: thickness,
        borderColor: 'transparent',
        borderTopColor: 'transparent',
        transform: [{ rotate: `${p.span}deg` }],
      }}
    />
  </View>
))}


      {/* inner hole */}
      <View
        style={{
          position: 'absolute',
          width: size - thickness * 1.6,
          height: size - thickness * 1.6,
          borderRadius: (size - thickness * 1.6) / 2,
          backgroundColor: COLORS.white,
        }}
      />
    </View>
  );
}




function BudgetBars({ data }) {
  return (
    <View style={{ width: 140, justifyContent: 'space-between' }}>
      {data.map((d) => (
        <View key={d.label} style={{ marginVertical: 6 }}>
          <View style={{ height: 8, backgroundColor: COLORS.grayLight, borderRadius: 8 }}>
            <View style={{ height: 8, width: `${d.value}%`, backgroundColor: d.color, borderRadius: 8 }} />
          </View>
        </View>
      ))}
    </View>
  );
}

/* ---------------- Weekly Spending Trend (no libs) ---------------- */

function TrendChart({ points }) {
  const yLabels = ['₱350', '₱210', '₱70'];
  const weeks = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
  const H = 140, max = 350, min = 70;
  const toY = (v) => {
    const c = Math.max(min, Math.min(max, v));
    const ratio = (c - min) / (max - min);
    return H - ratio * H;
  };
  const Xs = [0, 1, 2, 3].map(i => 18 + i * 70);

  return (
    <View style={styles.trendWrap}>
      <View style={styles.yAxis}>
        {yLabels.map((t, i) => (<Text key={i} style={styles.yTxt}>{t}</Text>))}
      </View>

      <View style={styles.chartArea}>
        {[0, 1, 2].map(i => (<View key={i} style={[styles.hLine, { top: i * (H / 2) }]} />))}
        {points.map((p, i) => {
          const y = toY(p), x = Xs[i];
          const next = i < points.length - 1 ? { x: Xs[i + 1], y: toY(points[i + 1]) } : null;
          const line = next ? lineBetween({ x, y }, next) : null;

          return (
            <View key={i} style={{ position: 'absolute', left: x, top: y }}>
              {line && (
                <View
                  style={{
                    position: 'absolute', left: 0, top: 0, width: line.length, height: 2,
                    backgroundColor: COLORS.steelBlue,
                    transform: [{ translateX: 5 }, { translateY: 5 }, { rotateZ: `${line.angle}rad` }],
                    opacity: 0.85,
                  }}
                />
              )}
              <View style={{
                width: 10, height: 10, borderRadius: 5,
                backgroundColor: COLORS.steelBlue,
                borderWidth: 2, borderColor: COLORS.white
              }} />
            </View>
          );
        })}
        {weeks.map((w, i) => (
          <Text key={w} style={[styles.weekTxt, { left: Xs[i] - 16, top: H + 12 }]}>{w}</Text>
        ))}
      </View>
    </View>
  );
}
function lineBetween(a, b) {
  const dx = b.x - a.x, dy = b.y - a.y;
  return { length: Math.hypot(dx, dy), angle: Math.atan2(dy, dx) };
}

/* ---------------- Styles ---------------- */

const styles = StyleSheet.create({
  hLineZero: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: COLORS.grayLight, // same color, but full opacity
    opacity: 1,
  },
  monthRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 12, marginTop: 6, marginBottom: 6,
  },
  menuBtn: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  menuTxt: { fontSize: 18, color: COLORS.nearBlack },
  arrowBtn: { width: 28, height: 28, alignItems: 'center', justifyContent: 'center' },
  arrowTxt: { fontSize: 18, color: COLORS.nearBlack },
  monthText: { fontWeight: '700', color: COLORS.nearBlack },
  refreshBtn: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  refreshTxt: { fontSize: 16, color: COLORS.nearBlack },

  headlineRow: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 8, marginBottom: 8 },
  headCol: { alignItems: 'center', flex: 1 },
  headLabel: { color: COLORS.nearBlack, fontWeight: '700', fontSize: 12, marginBottom: 2, opacity: 0.7 },
  headerAmount: { fontWeight: '800', fontSize: 18 },

  tipBanner: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: COLORS.skyBlue, padding: 12, borderRadius: 12,
    marginVertical: 12, marginHorizontal: 4,
  },
  tipEmoji: { marginRight: 8, fontSize: 18 },
  tipText: { color: COLORS.black, flex: 1, fontWeight: '600' },

  duo: { flexDirection: 'row', gap: 10, marginTop: 0, marginBottom: 10, paddingHorizontal: 4 },
  statCard: {
    flex: 1, borderRadius: 14, padding: 14,
    shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 10, elevation: 2,
  },
  statHdr: { color: COLORS.white, fontWeight: '800', fontSize: 12, opacity: 0.9 },
  statVal: { color: COLORS.white, fontWeight: '900', fontSize: 22, marginTop: 6 },

  cardOuter: { padding: 14, borderRadius: 16, marginBottom: 12 },
  sectionTitle: { fontWeight: '800', color: COLORS.nearBlack, marginBottom: 8 },

  /* Activity chart */
  activityChart: { flexDirection: 'row', marginTop: 6 },
  yAxisLeft: { width: 48, paddingTop: 2 },
  yLeftTxt: { color: '#6B7280', marginBottom: 24, fontSize: 11 },
  activityGrid: { flex: 1, position: 'relative' },
  hLine: { position: 'absolute', left: 0, right: 0, height: 1, backgroundColor: COLORS.grayLight },
  barsRow: { position: 'absolute', left: 0, right: 0, top: 8, bottom: 30, flexDirection: 'row', alignItems: 'flex-end' },
  barGroup: { alignItems: 'center', justifyContent: 'flex-end' },
  dualRow: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'center' },
  bar: {
  borderTopLeftRadius: 4,
  borderTopRightRadius: 4,
  borderBottomLeftRadius: 0,
  borderBottomRightRadius: 0,
  shadowColor: '#000',
  shadowOpacity: 0.06,
  shadowRadius: 6,
  elevation: 1,
},

  pillRow: { flexDirection: 'row', justifyContent: 'center', gap: 12, paddingTop: 14, paddingBottom: 2 },
  pill: { paddingVertical: 8, paddingHorizontal: 16, borderRadius: 20 },
  pillNeutral: { backgroundColor: '#E5E7EB' },
  pillActiveRed: { backgroundColor: COLORS.red },
  pillActiveGreen: { backgroundColor: COLORS.green },
  pillTxt: { color: COLORS.nearBlack, fontWeight: '700' },
  pillTxtActive: { color: COLORS.white, fontWeight: '700' },

  /* Budget Overview */
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  cardTitle: { fontWeight: '800', color: COLORS.nearBlack },
  switchWrap: { backgroundColor: '#F2F3F6', borderRadius: 18, padding: 4, flexDirection: 'row' },
  switchBtn: { paddingVertical: 6, paddingHorizontal: 10, borderRadius: 14 },
  switchActive: { backgroundColor: COLORS.white, borderWidth: 1, borderColor: COLORS.grayLight },
  switchTxt: { color: '#6B7280', fontWeight: '700', fontSize: 12 },
  switchTxtActive: { color: COLORS.nearBlack },
  budgetWrap: { flexDirection: 'row', alignItems: 'center' },
  legendRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  legendDot: { width: 10, height: 10, borderRadius: 5, marginRight: 8 },
  legendLabel: { color: COLORS.nearBlack, fontWeight: '600' },
  legendPct: { color: '#6B7280', fontWeight: '600' },

  /* Weekly Spending Trend */
  blueLabel: { alignSelf: 'flex-start', backgroundColor: COLORS.steelBlue, borderRadius: 6, paddingHorizontal: 10, paddingVertical: 4, marginBottom: 8 },
  blueLabelTxt: { color: COLORS.white, fontWeight: '800', fontSize: 12 },
  trendWrap: { flexDirection: 'row' },
  yAxis: { width: 44, paddingTop: 6 },
  yTxt: { color: '#6B7280', marginBottom: 42, fontSize: 12 },
  chartArea: { flex: 1, height: 170, position: 'relative' },
  weekTxt: { position: 'absolute', color: '#6B7280', fontSize: 12 },
});
